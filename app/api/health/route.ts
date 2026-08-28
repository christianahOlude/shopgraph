import { NextResponse } from "next/server";
import { getDriver } from "@/lib/neo4j";

export async function GET() {
    const driver = getDriver();

    try {
        await driver.verifyConnectivity();

        return NextResponse.json({
            success: true,
            message: "Connected to CognoDB successfully",
        });
    } catch (error) {
        console.error("CognoDB connection failed:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Unable to connect to CognoDB",
            },
            { status: 500 },
        );
    } finally {
        await driver.close();
    }
}