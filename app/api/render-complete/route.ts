import { NextRequest, NextResponse } from "next/server";
import { updateJobStatus } from "@/lib/jobStore";

export async function POST(request: NextRequest) {
    try {
        const { jobId, status, videoUrl, error, progress, message } =
            await request.json();

        console.log(`🔔 Webhook received for job ${jobId}: ${status}`);

        // Update job status in store (will notify subscribers)
        updateJobStatus(jobId, {
            id: jobId,
            status,
            progress: progress || (status === "completed" ? 100 : 0),
            message,
            videoUrl,
            error,
            updatedAt: new Date(),
        });

        if (status === "completed") {
            console.log(`✅ Video ready: ${videoUrl}`);
        } else if (status === "failed") {
            console.error(`❌ Job ${jobId} failed: ${error}`);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("❌ Webhook error:", error);
        return NextResponse.json(
            {
                error: "Webhook processing failed",
                details:
                    error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
