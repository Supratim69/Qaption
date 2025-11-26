import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

interface KaraokeProps {
    text: string;
    startFrame: number;
    endFrame: number;
}

export const Karaoke: React.FC<KaraokeProps> = ({
    text,
    startFrame,
    endFrame,
}) => {
    const frame = useCurrentFrame();

    // Calculate progress (0 to 1) for the highlight effect
    const progress = interpolate(frame, [startFrame, endFrame], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });

    const words = text.split(" ");
    const wordsToHighlight = Math.floor(progress * words.length);

    return (
        <AbsoluteFill
            style={{
                justifyContent: "flex-end",
                alignItems: "center",
                paddingBottom: 80,
                pointerEvents: "none",
            }}
        >
            <div
                style={{
                    backgroundColor: "rgba(0, 0, 0, 0.85)",
                    padding: "20px 40px",
                    borderRadius: 12,
                    maxWidth: "85%",
                }}
            >
                <p
                    style={{
                        fontSize: 44,
                        fontWeight: 700,
                        textAlign: "center",
                        margin: 0,
                        fontFamily:
                            "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
                        lineHeight: 1.5,
                    }}
                >
                    {words.map((word, index) => (
                        <span
                            key={index}
                            style={{
                                color:
                                    index < wordsToHighlight
                                        ? "#FFD700"
                                        : "white",
                                transition: "color 0.1s ease",
                                marginRight: "0.3em",
                            }}
                        >
                            {word}
                        </span>
                    ))}
                </p>
            </div>
        </AbsoluteFill>
    );
};
