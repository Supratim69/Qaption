import { NextRequest, NextResponse } from "next/server";
import { uploadToS3 } from "@/lib/s3";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("video") as File;

        if (!file) {
            return NextResponse.json(
                { error: "No file uploaded" },
                { status: 400 }
            );
        }

        // Validate file type
        if (!file.type.startsWith("video/")) {
            return NextResponse.json(
                { error: "File must be a video" },
                { status: 400 }
            );
        }

        // Validate file size (100MB)
        const maxSize = 100 * 1024 * 1024; // 100MB
        if (file.size > maxSize) {
            return NextResponse.json(
                { error: "File size must be less than 100MB" },
                { status: 400 }
            );
        }

        console.log(
            "📤 Uploading video to S3:",
            file.name,
            `(${(file.size / 1024 / 1024).toFixed(2)}MB)`
        );

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload to S3
        const s3Url = await uploadToS3(buffer, file.name, file.type);

        console.log("✅ Upload complete:", s3Url);

        return NextResponse.json({
            success: true,
            videoUrl: s3Url,
            filename: file.name,
        });
    } catch (error) {
        console.error("❌ Upload error:", error);
        return NextResponse.json(
            {
                error: "Failed to upload file",
                details:
                    error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
