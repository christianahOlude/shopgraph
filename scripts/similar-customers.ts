import dotenv from "dotenv";
import neo4j from "neo4j-driver";

dotenv.config({ path: ".env.local" });

const uri = process.env.COGNODB_URI;
const username = process.env.COGNODB_USERNAME;
const password = process.env.COGNODB_PASSWORD;

if (!uri || !username || !password) {
    throw new Error("CognoDB environment variables are not configured");
}

const driver = neo4j.driver(
    uri,
    neo4j.auth.basic(username, password)
);

async function findSimilarCustomers(customerId: string) {
    const session = driver.session();

    try {
        const result = await session.executeRead((tx) => {
            return tx.run(
                `
        MATCH (customer:Customer {id: $customerId})
              -[:BOUGHT]->(product:Product)
              <-[:BOUGHT]-(similar:Customer)

        WHERE similar.id <> $customerId

        WITH similar, count(DISTINCT product) AS sharedProducts

        RETURN
          similar.id AS id,
          similar.name AS name,
          sharedProducts

        ORDER BY sharedProducts DESC

        LIMIT 10
        `,
                { customerId }
            );
        });

        return result.records.map((record) => ({
            id: record.get("id"),
            name: record.get("name"),
            sharedProducts: record.get("sharedProducts").toNumber(),
        }));
    } finally {
        await session.close();
    }
}

async function main() {
    const customerId = process.argv[2] ?? "C001";

    try {
        console.log(`Finding customers similar to ${customerId}...\n`);

        await driver.verifyConnectivity();

        const customers = await findSimilarCustomers(customerId);

        if (customers.length === 0) {
            console.log("No similar customers found.");
            return;
        }

        console.table(customers);
    } catch (error) {
        console.error("Similar customer query failed:", error);
        process.exitCode = 1;
    } finally {
        await driver.close();
    }
}

main();