import { NextRequest, NextResponse } from "next/server";
import { transcribeVideo } from "@/lib/assemblyai";

export async function POST(request: NextRequest) {
    try {
        const { videoUrl } = await request.json();

        if (!videoUrl) {
            return NextResponse.json(
                { error: "Video URL is required" },
                { status: 400 }
            );
        }

        console.log("📹 Starting transcription for:", videoUrl);
        console.log("⏱️  This may take 15-30% of the video duration...");

        // Transcribe the video (file will be uploaded directly to AssemblyAI)
        const captions = await transcribeVideo(videoUrl);

        console.log(
            "✅ Transcription complete! Generated",
            captions.length,
            "captions"
        );

        return NextResponse.json({
            success: true,
            captions,
        });
    } catch (error) {
        console.error("Transcription error:", error);
        return NextResponse.json(
            {
                error: "Failed to transcribe video",
                details:
                    error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
