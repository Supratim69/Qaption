"use client";

import React, { useState } from "react";

interface VideoUploaderProps {
    onUploadSuccess: (videoUrl: string) => void;
}

export const VideoUploader: React.FC<VideoUploaderProps> = ({
    onUploadSuccess,
}) => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("video/")) {
            setError("Please upload a video file");
            return;
        }

        // Validate file size (max 100MB)
        if (file.size > 100 * 1024 * 1024) {
            setError("File size must be less than 100MB");
            return;
        }

        setUploading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append("video", file);

            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Upload failed");
            }

            onUploadSuccess(data.videoUrl);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Upload failed");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="w-full">
            <label
                htmlFor="video-upload"
                className="flex flex-col items-center justify-center w-full h-48 border border-dashed border-[#3A3A3A] rounded-md cursor-pointer bg-[#1E1E1E] hover:border-[#3B82F6] transition-colors"
            >
                <div className="flex flex-col items-center justify-center">
                    <svg
                        className="w-10 h-10 mb-3 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                    </svg>
                    <p className="mb-1 text-sm text-gray-300">
                        <span className="font-medium">Click to upload</span> or
                        drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                        MP4, MOV, AVI (max 100MB)
                    </p>
                </div>
                <input
                    id="video-upload"
                    type="file"
                    className="hidden"
                    accept="video/*"
                    onChange={handleFileChange}
                    disabled={uploading}
                />
            </label>

            {uploading && (
                <div className="mt-4 flex items-center justify-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#3A3A3A] border-t-[#3B82F6]"></div>
                    <p className="text-sm text-gray-400">Uploading...</p>
                </div>
            )}

            {error && (
                <div className="mt-4 p-3 bg-red-950/30 border border-red-800/50 rounded-md">
                    <p className="text-sm text-red-400">{error}</p>
                </div>
            )}
        </div>
    );
};
