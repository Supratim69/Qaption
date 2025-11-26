"use client";

import React, { useState, useEffect } from "react";
import { Caption, CaptionStyle } from "@/lib/types";
import { downloadCaptions } from "@/lib/utils";

interface DownloadButtonProps {
    videoUrl: string;
    captions: Caption[];
    style: CaptionStyle;
}

interface JobStatus {
    id: string;
    status: "pending" | "processing" | "completed" | "failed";
    progress: number;
    message?: string;
    videoUrl?: string;
    error?: string;
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({
    videoUrl,
    captions,
    style,
}) => {
    const [jobId, setJobId] = useState<string | null>(null);
    const [jobStatus, setJobStatus] = useState<JobStatus | null>(null);
    const [isRendering, setIsRendering] = useState(false);
    const [renderError, setRenderError] = useState<string | null>(null);

    // Poll for job status (works reliably with serverless)
    useEffect(() => {
        if (!jobId) return;

        const pollInterval = setInterval(async () => {
            try {
                const response = await fetch(`/api/render/status/${jobId}`);
                const data = await response.json();

                setJobStatus(data);

                // Stop polling if job is completed or failed
                if (data.status === "completed" || data.status === "failed") {
                    clearInterval(pollInterval);
                    setIsRendering(false);

                    if (data.status === "failed") {
                        setRenderError(data.error || "Render failed");
                    }
                }
            } catch (error) {
                console.error("Error polling status:", error);
            }
        }, 3000); // Poll every 3 seconds

        return () => clearInterval(pollInterval);
    }, [jobId]);

    const handleDownloadCaptions = (format: "srt" | "vtt") => {
        downloadCaptions(captions, format, `captions-${Date.now()}`);
    };

    const handleStartRender = async () => {
        setIsRendering(true);
        setRenderError(null);
        setJobId(null);
        setJobStatus(null);

        try {
            const response = await fetch("/api/render", {
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

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to submit render job");
            }

            setJobId(data.jobId);
            setJobStatus({
                id: data.jobId,
                status: "pending",
                progress: 0,
                message: "Job submitted...",
            });
        } catch (error) {
            console.error("Render error:", error);
            setRenderError(
                error instanceof Error
                    ? error.message
                    : "Failed to start render"
            );
            setIsRendering(false);
        }
    };

    const handleDownloadVideo = async () => {
        if (!jobStatus?.videoUrl) return;

        try {
            // Fetch the video as blob
            const response = await fetch(jobStatus.videoUrl);
            const blob = await response.blob();

            // Create download link
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `captioned-video-${Date.now()}.mp4`;
            document.body.appendChild(a);
            a.click();

            // Cleanup
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error("Download error:", error);
            // Fallback to opening in new tab
            window.open(jobStatus.videoUrl, "_blank");
        }
    };

    const handleReset = () => {
        setJobId(null);
        setJobStatus(null);
        setIsRendering(false);
        setRenderError(null);
    };

    // Show completed state with download button
    if (jobStatus?.status === "completed") {
        return (
            <div className="w-full space-y-3">
                <div className="p-5 bg-green-950/30 border border-green-800/50 rounded-md">
                    <div className="flex items-center gap-3 mb-3">
                        <svg
                            className="w-6 h-6 text-green-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <h3 className="text-base font-semibold text-green-400">
                            Render Complete!
                        </h3>
                    </div>
                    <p className="text-sm text-green-300/80">
                        Your video has been rendered successfully.
                    </p>
                </div>

                <button
                    onClick={handleDownloadVideo}
                    className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white font-medium py-3 px-6 rounded-md transition-colors cursor-pointer"
                >
                    Download Video
                </button>

                <button
                    onClick={handleReset}
                    className="w-full bg-[#2D2D2D] border border-[#3A3A3A] hover:border-[#3B82F6]/50 text-[#F3F4F6] font-medium py-2.5 px-6 rounded-md transition-colors cursor-pointer"
                >
                    Render Another Video
                </button>

                <div className="flex gap-3">
                    <button
                        onClick={() => handleDownloadCaptions("srt")}
                        className="flex-1 bg-[#2D2D2D] border border-[#3A3A3A] hover:border-[#3B82F6]/50 text-[#F3F4F6] font-medium py-2.5 px-4 rounded-md transition-colors cursor-pointer"
                    >
                        Download SRT
                    </button>
                    <button
                        onClick={() => handleDownloadCaptions("vtt")}
                        className="flex-1 bg-[#2D2D2D] border border-[#3A3A3A] hover:border-[#3B82F6]/50 text-[#F3F4F6] font-medium py-2.5 px-4 rounded-md transition-colors cursor-pointer"
                    >
                        Download VTT
                    </button>
                </div>
            </div>
        );
    }

    // Show progress during rendering
    if (isRendering && jobStatus) {
        return (
            <div className="w-full space-y-3">
                <div className="p-5 bg-[#1E1E1E] border border-[#3A3A3A] rounded-md">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-base font-semibold text-[#F3F4F6]">
                            Rendering Video...
                        </h3>
                        <span className="text-sm font-medium text-[#3B82F6]">
                            {jobStatus.progress}%
                        </span>
                    </div>

                    <div className="w-full bg-[#2D2D2D] rounded-full h-2.5 mb-3">
                        <div
                            className="bg-[#3B82F6] h-2.5 rounded-full transition-all duration-300"
                            style={{ width: `${jobStatus.progress}%` }}
                        ></div>
                    </div>

                    <p className="text-sm text-gray-400">
                        {jobStatus.message || "Processing..."}
                    </p>

                    <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                        <svg
                            className="animate-spin h-4 w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                        </svg>
                        <span>Status: {jobStatus.status}</span>
                        <span>•</span>
                        <span>Job ID: {jobStatus.id}</span>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => handleDownloadCaptions("srt")}
                        className="flex-1 bg-[#2D2D2D] border border-[#3A3A3A] hover:border-[#3B82F6]/50 text-[#F3F4F6] font-medium py-2.5 px-4 rounded-md transition-colors cursor-pointer"
                    >
                        Download SRT
                    </button>
                    <button
                        onClick={() => handleDownloadCaptions("vtt")}
                        className="flex-1 bg-[#2D2D2D] border border-[#3A3A3A] hover:border-[#3B82F6]/50 text-[#F3F4F6] font-medium py-2.5 px-4 rounded-md transition-colors cursor-pointer"
                    >
                        Download VTT
                    </button>
                </div>
            </div>
        );
    }

    // Initial state - ready to render
    return (
        <div className="w-full space-y-3">
            <button
                onClick={handleStartRender}
                disabled={isRendering}
                className="w-full bg-[#3B82F6] hover:bg-[#2563EB] disabled:bg-[#3A3A3A] disabled:text-gray-500 text-white font-medium py-3 px-6 rounded-md transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
                {isRendering ? (
                    <span className="flex items-center justify-center">
                        <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                        </svg>
                        Starting...
                    </span>
                ) : (
                    "Render Video with Captions"
                )}
            </button>

            {renderError && (
                <div className="p-3 bg-red-950/30 border border-red-800/50 rounded-md">
                    <p className="text-sm text-red-400">{renderError}</p>
                </div>
            )}

            <div className="flex gap-3">
                <button
                    onClick={() => handleDownloadCaptions("srt")}
                    className="flex-1 bg-[#2D2D2D] border border-[#3A3A3A] hover:border-[#3B82F6]/50 text-[#F3F4F6] font-medium py-2.5 px-4 rounded-md transition-colors cursor-pointer"
                >
                    Download SRT
                </button>
                <button
                    onClick={() => handleDownloadCaptions("vtt")}
                    className="flex-1 bg-[#2D2D2D] border border-[#3A3A3A] hover:border-[#3B82F6]/50 text-[#F3F4F6] font-medium py-2.5 px-4 rounded-md transition-colors cursor-pointer"
                >
                    Download VTT
                </button>
            </div>
        </div>
    );
};
