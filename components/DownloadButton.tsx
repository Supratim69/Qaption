"use client";

import React, { useState } from "react";
import { Caption, CaptionStyle } from "@/lib/types";
import { downloadCaptions } from "@/lib/utils";

interface DownloadButtonProps {
    videoUrl: string;
    captions: Caption[];
    style: CaptionStyle;
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({
    videoUrl,
    captions,
    style,
}) => {
    const [showInstructions, setShowInstructions] = useState(false);
    const [renderCommand, setRenderCommand] = useState<string>("");
    const [isRendering, setIsRendering] = useState(false);
    const [renderError, setRenderError] = useState<string | null>(null);

    const handleShowInstructions = async () => {
        // Generate render command
        const timestamp = Date.now();
        const propsData = {
            videoUrl,
            captions,
            style,
        };

        const propsJson = JSON.stringify(propsData);
        const command = `npx remotion render remotion/Root.tsx VideoWithCaptions output-${timestamp}.mp4 --props='${propsJson}'`;

        setRenderCommand(command);
        setShowInstructions(true);
    };

    const handleCopyCommand = () => {
        navigator.clipboard.writeText(renderCommand);
        alert("Command copied to clipboard!");
    };

    const handleDownloadCaptions = (format: "srt" | "vtt") => {
        downloadCaptions(captions, format, `captions-${Date.now()}`);
    };

    const handlePrepareRender = async () => {
        setIsRendering(true);
        setRenderError(null);

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
                throw new Error(data.error || "Preparation failed");
            }

            // Set the render command and show instructions
            setRenderCommand(data.renderCommand);
            setShowInstructions(true);
        } catch (error) {
            console.error("Preparation error:", error);
            setRenderError(
                error instanceof Error
                    ? error.message
                    : "Failed to prepare render"
            );
        } finally {
            setIsRendering(false);
        }
    };

    if (!showInstructions) {
        return (
            <div className="w-full space-y-3">
                <button
                    onClick={handlePrepareRender}
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
                            Preparing...
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
    }

    return (
        <div className="w-full space-y-4">
            <div className="p-5 bg-[#1E1E1E] border border-[#3A3A3A] rounded-md">
                <h3 className="text-base font-semibold text-[#F3F4F6] mb-4">
                    Render Instructions
                </h3>

                <div className="space-y-4">
                    <div>
                        <p className="text-sm font-medium text-[#F3F4F6] mb-1">
                            1. Open Terminal
                        </p>
                        <p className="text-sm text-gray-400">
                            Navigate to your project directory
                        </p>
                    </div>

                    <div>
                        <p className="text-sm font-medium text-[#F3F4F6] mb-2">
                            2. Run Command
                        </p>
                        <div className="relative">
                            <pre className="bg-[#0F172A] border border-[#3A3A3A] p-3 rounded-md text-xs overflow-x-auto text-[#F3F4F6]">
                                {renderCommand}
                            </pre>
                            <button
                                onClick={handleCopyCommand}
                                className="absolute top-2 right-2 bg-[#2D2D2D] border border-[#3A3A3A] hover:bg-[#3B82F6] text-gray-300 hover:text-white px-2 py-1 rounded text-xs cursor-pointer transition-colors"
                            >
                                Copy
                            </button>
                        </div>
                    </div>

                    <div>
                        <p className="text-sm font-medium text-[#F3F4F6] mb-1">
                            3. Find Output
                        </p>
                        <p className="text-sm text-gray-400">
                            Video saved as{" "}
                            <code className="bg-[#2D2D2D] border border-[#3A3A3A] px-2 py-0.5 rounded text-xs">
                                output-[timestamp].mp4
                            </code>
                        </p>
                    </div>
                </div>
            </div>

            <button
                onClick={() => setShowInstructions(false)}
                className="w-full bg-[#2D2D2D] border border-[#3A3A3A] hover:border-[#3B82F6]/50 text-[#F3F4F6] font-medium py-2.5 px-6 rounded-md transition-colors cursor-pointer"
            >
                Back
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
};
