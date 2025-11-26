"use client";

import React, { useState } from "react";
import { VideoUploader } from "@/components/VideoUploader";
import { StyleSelector } from "@/components/StyleSelector";
import { CaptionEditor } from "@/components/CaptionEditor";
import { VideoPreview } from "@/components/VideoPreview";
import { DownloadButton } from "@/components/DownloadButton";
import { Caption, CaptionStyle } from "@/lib/types";

export default function Home() {
    const [videoUrl, setVideoUrl] = useState<string>("");
    const [captions, setCaptions] = useState<Caption[]>([]);
    const [captionStyle, setCaptionStyle] =
        useState<CaptionStyle>("bottom-centered");
    const [isTranscribing, setIsTranscribing] = useState(false);
    const [transcriptionError, setTranscriptionError] = useState<string | null>(
        null
    );
    const [currentStep, setCurrentStep] = useState(1);

    const handleUploadSuccess = (url: string) => {
        setVideoUrl(url);
        setCaptions([]);
        setTranscriptionError(null);
        setCurrentStep(2);
    };

    const handleGenerateCaptions = async () => {
        if (!videoUrl) return;

        setIsTranscribing(true);
        setTranscriptionError(null);

        try {
            const response = await fetch("/api/transcribe", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ videoUrl }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Transcription failed");
            }

            setCaptions(data.captions);
            setCurrentStep(3);
        } catch (error) {
            console.error("Transcription error:", error);
            setTranscriptionError(
                error instanceof Error
                    ? error.message
                    : "Failed to generate captions"
            );
        } finally {
            setIsTranscribing(false);
        }
    };

    const handleExportInstructions = () => {
        const instructions = `
🎬 Export Your Captioned Video

Option 1: Using Remotion CLI
────────────────────────────
1. Install Remotion CLI globally:
   npm install -g @remotion/cli

2. Render your video:
   npx remotion render remotion/Root.tsx VideoWithCaptions output.mp4

Option 2: Using Remotion Studio (GUI)
──────────────────────────────────────
1. Open Remotion Studio:
   npx remotion studio

2. Select your composition and click "Render"

Your video will be exported in Full HD (1920x1080) at 30 FPS!
    `;
        alert(instructions);
    };

    return (
        <main className="min-h-screen bg-[#1E1E1E]">
            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="mb-16 pb-8 border-b border-[#3A3A3A]">
                    <h1 className="text-4xl font-semibold text-[#F3F4F6] mb-2 tracking-tight">
                        Qaption
                    </h1>
                    <p className="text-lg text-gray-400">
                        Automatic transcription with Hinglish support
                    </p>
                </div>

                {/* Progress Steps */}
                <div className="mb-12">
                    <div className="flex items-center space-x-4">
                        {[
                            { num: 1, label: "Upload" },
                            { num: 2, label: "Generate" },
                            { num: 3, label: "Customize" },
                            { num: 4, label: "Export" },
                        ].map((step, idx) => (
                            <React.Fragment key={step.num}>
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                                            currentStep >= step.num
                                                ? "bg-[#3B82F6] text-white"
                                                : "bg-[#2D2D2D] border border-[#3A3A3A] text-gray-500"
                                        }`}
                                    >
                                        {step.num}
                                    </div>
                                    <span
                                        className={`text-sm font-medium ${
                                            currentStep >= step.num
                                                ? "text-[#F3F4F6]"
                                                : "text-gray-500"
                                        }`}
                                    >
                                        {step.label}
                                    </span>
                                </div>
                                {idx < 3 && (
                                    <div
                                        className={`flex-1 h-px ${
                                            currentStep > step.num
                                                ? "bg-[#3B82F6]"
                                                : "bg-[#3A3A3A]"
                                        }`}
                                    />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column - Controls */}
                    <div className="space-y-6">
                        {/* Upload Section */}
                        <div className="bg-[#2D2D2D] border border-[#3A3A3A] rounded-lg p-6">
                            <h2 className="text-lg font-semibold text-[#F3F4F6] mb-4">
                                Upload Video
                            </h2>
                            <VideoUploader
                                onUploadSuccess={handleUploadSuccess}
                            />
                        </div>

                        {/* Generate Captions */}
                        {videoUrl && (
                            <div className="bg-[#2D2D2D] border border-[#3A3A3A] rounded-lg p-6">
                                <h2 className="text-lg font-semibold text-[#F3F4F6] mb-4">
                                    Generate Captions
                                </h2>
                                <button
                                    onClick={handleGenerateCaptions}
                                    disabled={isTranscribing}
                                    className="w-full bg-[#3B82F6] hover:bg-[#2563EB] disabled:bg-[#3A3A3A] disabled:text-gray-500 text-white font-medium py-3 px-6 rounded-md transition-colors cursor-pointer disabled:cursor-not-allowed"
                                >
                                    {isTranscribing ? (
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
                                            Transcribing...
                                        </span>
                                    ) : (
                                        "Generate Captions"
                                    )}
                                </button>
                                {transcriptionError && (
                                    <div className="mt-4 p-3 bg-red-950/30 border border-red-800/50 rounded-md">
                                        <p className="text-sm text-red-400">
                                            {transcriptionError}
                                        </p>
                                    </div>
                                )}
                                <div className="mt-4 p-3 bg-[#1E1E1E] border border-[#3A3A3A] rounded-md">
                                    <p className="text-xs text-gray-400">
                                        Powered by AssemblyAI • Hinglish support
                                        included
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Style Selector */}
                        {captions.length > 0 && (
                            <div className="bg-[#2D2D2D] border border-[#3A3A3A] rounded-lg p-6">
                                <h2 className="text-lg font-semibold text-[#F3F4F6] mb-4">
                                    Caption Style
                                </h2>
                                <StyleSelector
                                    selectedStyle={captionStyle}
                                    onStyleChange={setCaptionStyle}
                                />
                            </div>
                        )}

                        {/* Caption Editor */}
                        {captions.length > 0 && (
                            <div className="bg-[#2D2D2D] border border-[#3A3A3A] rounded-lg p-6">
                                <h2 className="text-lg font-semibold text-[#F3F4F6] mb-4">
                                    Edit Captions
                                </h2>
                                <CaptionEditor
                                    captions={captions}
                                    onCaptionsChange={setCaptions}
                                />
                            </div>
                        )}
                    </div>

                    {/* Right Column - Preview & Export */}
                    <div className="space-y-6">
                        {videoUrl && captions.length > 0 ? (
                            <>
                                {/* Preview */}
                                <div className="bg-[#2D2D2D] border border-[#3A3A3A] rounded-lg p-6">
                                    <h2 className="text-lg font-semibold text-[#F3F4F6] mb-4">
                                        Preview
                                    </h2>
                                    <VideoPreview
                                        videoUrl={videoUrl}
                                        captions={captions}
                                        style={captionStyle}
                                    />
                                </div>

                                {/* Download */}
                                <div className="bg-[#2D2D2D] border border-[#3A3A3A] rounded-lg p-6">
                                    <h2 className="text-lg font-semibold text-[#F3F4F6] mb-4">
                                        Export
                                    </h2>
                                    <DownloadButton
                                        videoUrl={videoUrl}
                                        captions={captions}
                                        style={captionStyle}
                                    />
                                    <div className="mt-4 p-3 bg-[#1E1E1E] border border-[#3A3A3A] rounded-md">
                                        <p className="text-xs text-gray-400">
                                            Output: 1920x1080 @ 30 FPS
                                        </p>
                                    </div>
                                </div>
                            </>
                        ) : (
                            /* Empty State */
                            <div className="bg-[#2D2D2D] border border-[#3A3A3A] rounded-lg p-12 text-center">
                                <div className="mb-6">
                                    <svg
                                        className="w-16 h-16 mx-auto text-gray-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-[#F3F4F6] mb-2">
                                    No video uploaded
                                </h3>
                                <p className="text-sm text-gray-400 mb-6">
                                    Upload a video to begin
                                </p>
                                <div className="space-y-2 text-left max-w-xs mx-auto">
                                    <div className="text-sm text-gray-400">
                                        • Automatic transcription
                                    </div>
                                    <div className="text-sm text-gray-400">
                                        • Hinglish support
                                    </div>
                                    <div className="text-sm text-gray-400">
                                        • Multiple styles
                                    </div>
                                    <div className="text-sm text-gray-400">
                                        • Live preview
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-16 pt-8 border-t border-[#3A3A3A] text-center">
                    <p className="text-sm text-gray-500">
                        Powered by Next.js, Remotion, and AssemblyAI
                    </p>
                </div>
            </div>
        </main>
    );
}
