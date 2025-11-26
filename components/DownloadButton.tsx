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

    if (!showInstructions) {
        return (
            <div className="w-full space-y-3">
                <button
                    onClick={handleShowInstructions}
                    className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white font-medium py-3 px-6 rounded-md transition-colors cursor-pointer"
                >
                    Render Video
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

                    <div className="pt-3 border-t border-[#3A3A3A]">
                        <p className="text-xs text-gray-400 mb-1">
                            Rendering typically takes 1-2 minutes
                        </p>
                        <p className="text-xs text-gray-400">
                            <a
                                href="https://remotion.dev/docs/cli"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#3B82F6] underline hover:no-underline cursor-pointer"
                            >
                                Documentation
                            </a>
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
