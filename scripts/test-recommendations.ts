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

async function getRecommendations(customerId: string) {
    const session = driver.session();

    try {
        // First get the products this customer has already purchased
        const purchasedResult = await session.executeRead((tx) => {
            return tx.run(
                `
        MATCH (customer:Customer {id: $customerId})
              -[:BOUGHT]->(product:Product)

        RETURN collect(product.id) AS purchasedIds
        `,
                { customerId }
            );
        });

        const purchasedIds = purchasedResult.records[0].get("purchasedIds");

        // Find products purchased by customers with similar purchase history
        const result = await session.executeRead((tx) => {
            return tx.run(
                `
        MATCH (customer:Customer {id: $customerId})
              -[:BOUGHT]->(shared:Product)
              <-[:BOUGHT]-(similar:Customer)
              -[:BOUGHT]->(recommended:Product)

        WHERE similar.id <> $customerId
          AND NOT recommended.id IN $purchasedIds

        WITH recommended, count(DISTINCT similar) AS score

        RETURN
          recommended.id AS id,
          recommended.name AS name,
          recommended.description AS description,
          recommended.price AS price,
          recommended.rating AS rating,
          score

        ORDER BY score DESC, recommended.rating DESC

        LIMIT 10
        `,
                { customerId, purchasedIds }
            );
        });

        return result.records.map((record) => ({
            id: record.get("id"),
            name: record.get("name"),
            description: record.get("description"),
            price: record.get("price"),
            rating: record.get("rating"),
            score: record.get("score").toNumber(),
        }));
    } finally {
        await session.close();
    }
}

async function main() {
    const customerId = process.argv[2] ?? "C001";

    try {
        console.log(`Finding recommendations for ${customerId}...\n`);

        await driver.verifyConnectivity();

        const recommendations = await getRecommendations(customerId);

        if (recommendations.length === 0) {
            console.log("No recommendations found.");
            return;
        }

        console.table(recommendations);
    } catch (error) {
        console.error("Recommendation query failed:", error);
        process.exitCode = 1;
    } finally {
        await driver.close();
    }
}

main();