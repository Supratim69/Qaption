"use client";

import React, { useEffect, useState } from "react";
import { Player } from "@remotion/player";
import { VideoComposition } from "@/remotion/Composition";
import { Caption, CaptionStyle } from "@/lib/types";

interface VideoPreviewProps {
    videoUrl: string;
    captions: Caption[];
    style: CaptionStyle;
}

export const VideoPreview: React.FC<VideoPreviewProps> = ({
    videoUrl,
    captions,
    style,
}) => {
    const [duration, setDuration] = useState(300);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);

        // Get video duration
        const video = document.createElement("video");
        video.src = videoUrl;
        video.onloadedmetadata = () => {
            setDuration(Math.ceil(video.duration * 30)); // Convert to frames at 30fps
        };
    }, [videoUrl]);

    if (!isClient) {
        return (
            <div className="w-full aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Loading preview...</p>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="bg-black rounded-md overflow-hidden border border-[#3A3A3A]">
                <Player
                    component={VideoComposition}
                    inputProps={{
                        videoUrl,
                        captions,
                        style,
                    }}
                    durationInFrames={duration}
                    fps={30}
                    compositionWidth={1920}
                    compositionHeight={1080}
                    style={{
                        width: "100%",
                        aspectRatio: "16/9",
                    }}
                    controls
                />
            </div>
            <div className="mt-4 p-3 bg-[#1E1E1E] border border-[#3A3A3A] rounded-md">
                <p className="text-xs text-gray-400">
                    Real-time preview • Final export maintains full quality
                </p>
            </div>
        </div>
    );
};
