import React from "react";
import { AbsoluteFill, Video, useCurrentFrame, useVideoConfig } from "remotion";
import { Caption, CaptionStyle } from "@/lib/types";
import { BottomCentered } from "./CaptionStyles/BottomCentered";
import { TopBar } from "./CaptionStyles/TopBar";
import { Karaoke } from "./CaptionStyles/Karaoke";

interface CompositionProps {
    videoUrl: string;
    captions: Caption[];
    style: CaptionStyle;
}

export const VideoComposition: React.FC<CompositionProps> = ({
    videoUrl,
    captions,
    style,
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const currentTime = frame / fps;

    // Find the current caption based on time
    const currentCaption = captions.find(
        (caption) => currentTime >= caption.start && currentTime <= caption.end
    );

    const renderCaption = () => {
        if (!currentCaption) return null;

        const startFrame = Math.floor(currentCaption.start * fps);
        const endFrame = Math.floor(currentCaption.end * fps);

        switch (style) {
            case "bottom-centered":
                return <BottomCentered text={currentCaption.text} />;
            case "top-bar":
                return <TopBar text={currentCaption.text} />;
            case "karaoke":
                return (
                    <Karaoke
                        text={currentCaption.text}
                        startFrame={startFrame}
                        endFrame={endFrame}
                    />
                );
            default:
                return <BottomCentered text={currentCaption.text} />;
        }
    };

    return (
        <AbsoluteFill style={{ backgroundColor: "black" }}>
            <AbsoluteFill>
                <Video src={videoUrl} />
            </AbsoluteFill>
            {renderCaption()}
        </AbsoluteFill>
    );
};
