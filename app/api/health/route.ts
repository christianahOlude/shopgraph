import { NextResponse } from "next/server";
import { driver } from "@/lib/neo4j";

export async function GET() {
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
    }
}