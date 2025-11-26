import { NextRequest, NextResponse } from "next/server";

const RENDER_SERVICE_URL =
    process.env.RENDER_SERVICE_URL || "http://localhost:3001";

export async function POST(request: NextRequest) {
    try {
        const { videoUrl, captions, style } = await request.json();

        if (!videoUrl || !captions || !style) {
            return NextResponse.json(
                { error: "Missing required parameters" },
                { status: 400 }
            );
        }

        console.log("🎬 Submitting render job to microservice...");

        // Submit job to render service
        const response = await fetch(`${RENDER_SERVICE_URL}/api/render`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                videoUrl,
                captions,
                style,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Render service error");
        }

        const data = await response.json();

        console.log("✅ Render job submitted:", data.jobId);

        return NextResponse.json({
            success: true,
            jobId: data.jobId,
            message: "Render job submitted successfully",
            statusUrl: data.statusUrl,
        });
    } catch (error) {
        console.error("❌ Error:", error);
        return NextResponse.json(
            {
                error: "Failed to submit render job",
                details:
                    error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
