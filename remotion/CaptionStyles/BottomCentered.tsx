import React from "react";
import { AbsoluteFill } from "remotion";

interface BottomCenteredProps {
    text: string;
}

export const BottomCentered: React.FC<BottomCenteredProps> = ({ text }) => {
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
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    padding: "16px 32px",
                    borderRadius: 8,
                    maxWidth: "80%",
                }}
            >
                <p
                    style={{
                        fontSize: 42,
                        fontWeight: 700,
                        color: "white",
                        textAlign: "center",
                        margin: 0,
                        fontFamily:
                            "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
                        lineHeight: 1.4,
                    }}
                >
                    {text}
                </p>
            </div>
        </AbsoluteFill>
    );
};
