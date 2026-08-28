import { NextRequest, NextResponse } from "next/server";
import { getDriver } from "@/lib/neo4j";

export async function GET(request: NextRequest) {
    const customerId = request.nextUrl.searchParams.get("customerId");

    if (!customerId) {
        return NextResponse.json(
            { error: "customerId is required" },
            { status: 400 }
        );
    }

    const driver = getDriver();
    const session = driver.session();

    try {
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

        const purchasedIds =
            purchasedResult.records[0]?.get("purchasedIds") ?? [];

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

        const recommendations = result.records.map((record) => ({
            id: record.get("id"),
            name: record.get("name"),
            description: record.get("description"),
            price: record.get("price"),
            rating: record.get("rating"),
            score: record.get("score").toNumber(),
        }));

        return NextResponse.json({
            customerId,
            recommendations,
        });
    } catch (error) {
        console.error("Recommendation query failed:", error);

        return NextResponse.json(
            { error: "Failed to generate recommendations" },
            { status: 500 }
        );
    } finally {
        await session.close();
        await driver.close();
    }
}