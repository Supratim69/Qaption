import { NextRequest, NextResponse } from "next/server";
import { getJobStatus } from "@/lib/jobStore";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ jobId: string }> }
) {
    try {
        const { jobId } = await params;

        // First check local cache (populated by webhook)
        const cachedStatus = getJobStatus(jobId);
        if (cachedStatus) {
            return NextResponse.json(cachedStatus);
        }

        // Fallback to microservice if not in cache
        const RENDER_SERVICE_URL =
            process.env.RENDER_SERVICE_URL || "http://localhost:3001";

        const response = await fetch(
            `${RENDER_SERVICE_URL}/api/status/${jobId}`,
            { cache: "no-store" }
        );

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json(
                { error: errorData.error || "Failed to fetch status" },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("❌ Error fetching job status:", error);
        return NextResponse.json(
            {
                error: "Failed to fetch job status",
                details:
                    error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
