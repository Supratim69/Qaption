import React from "react";
import { AbsoluteFill } from "remotion";

interface TopBarProps {
    text: string;
}

export const TopBar: React.FC<TopBarProps> = ({ text }) => {
    return (
        <AbsoluteFill
            style={{
                justifyContent: "flex-start",
                alignItems: "stretch",
                pointerEvents: "none",
            }}
        >
            <div
                style={{
                    backgroundColor: "rgba(0, 0, 0, 0.9)",
                    padding: "20px 40px",
                    width: "100%",
                }}
            >
                <p
                    style={{
                        fontSize: 38,
                        fontWeight: 600,
                        color: "white",
                        textAlign: "left",
                        margin: 0,
                        fontFamily:
                            "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
                        lineHeight: 1.3,
                    }}
                >
                    {text}
                </p>
            </div>
        </AbsoluteFill>
    );
};
