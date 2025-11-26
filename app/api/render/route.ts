import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

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

        const timestamp = Date.now();
        const configFileName = `render-config-${timestamp}.json`;
        const outputDir = path.join(process.cwd(), "public", "outputs");
        const configPath = path.join(outputDir, configFileName);

        // Ensure output directory exists
        await mkdir(outputDir, { recursive: true });

        const renderConfig = {
            videoUrl,
            captions,
            style,
            timestamp,
            outputFileName: `captioned-video-${timestamp}.mp4`,
        };

        await writeFile(configPath, JSON.stringify(renderConfig, null, 2));

        console.log("✅ Configuration saved!");

        // Create PowerShell-compatible render command for Windows
        const propsJson = JSON.stringify(renderConfig);
        const outputPath = `public/outputs/captioned-video-${timestamp}.mp4`;

        // Escape quotes for PowerShell
        const escapedProps = propsJson.replace(/"/g, '`"');
        const renderCommand = `npx remotion render remotion/Root.tsx VideoWithCaptions ${outputPath} --props="${escapedProps}"`;

        return NextResponse.json({
            success: true,
            message: "Render configuration created",
            renderCommand,
            configFile: `/outputs/${configFileName}`,
            outputFileName: `captioned-video-${timestamp}.mp4`,
            outputPath: `/outputs/captioned-video-${timestamp}.mp4`,
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
