import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { downloadCaptions } from "@/lib/utils";

export async function POST(request: NextRequest) {
    try {
        const { videoUrl, captions, style } = await request.json();

        if (!videoUrl || !captions || !style) {
            return NextResponse.json(
                { error: "Missing required parameters" },
                { status: 400 }
            );
        }

        console.log("📝 Preparing render configuration...");

        // Save the render configuration to a JSON file
        const timestamp = Date.now();
        const configFileName = `render-config-${timestamp}.json`;
        const configPath = path.join(
            process.cwd(),
            "public",
            "outputs",
            configFileName
        );

        const renderConfig = {
            videoUrl,
            captions,
            style,
            timestamp,
            outputFileName: `captioned-video-${timestamp}.mp4`,
        };

        await writeFile(configPath, JSON.stringify(renderConfig, null, 2));

        console.log("✅ Configuration saved!");

        // Create CLI command
        const propsJson = JSON.stringify(renderConfig).replace(/"/g, '\\"');
        const renderCommand = `npx remotion render remotion/Root.tsx VideoWithCaptions public/outputs/captioned-video-${timestamp}.mp4 --props="${propsJson}"`;

        return NextResponse.json({
            success: true,
            message:
                "Render configuration created. Use Remotion CLI to render the video.",
            renderCommand,
            configFile: `/outputs/${configFileName}`,
            outputFileName: `captioned-video-${timestamp}.mp4`,
            instructions: {
                step1: "Open terminal in project directory",
                step2: "Copy and run the command below",
                step3: `Video will be saved as: public/outputs/captioned-video-${timestamp}.mp4`,
                step4: "Upload to S3 or download directly",
            },
        });
    } catch (error) {
        console.error("❌ Error:", error);
        return NextResponse.json(
            {
                error: "Failed to prepare render configuration",
                details:
                    error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
