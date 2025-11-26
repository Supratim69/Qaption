"use client";

import React from "react";
import { CaptionStyle } from "@/lib/types";

interface StyleSelectorProps {
    selectedStyle: CaptionStyle;
    onStyleChange: (style: CaptionStyle) => void;
}

const styles: { value: CaptionStyle; label: string; description: string }[] = [
    {
        value: "bottom-centered",
        label: "Bottom Centered",
        description: "Standard subtitle style at the bottom",
    },
    {
        value: "top-bar",
        label: "Top Bar",
        description: "News-style captions at the top",
    },
    {
        value: "karaoke",
        label: "Karaoke",
        description: "Highlighted words as they are spoken",
    },
];

export const StyleSelector: React.FC<StyleSelectorProps> = ({
    selectedStyle,
    onStyleChange,
}) => {
    return (
        <div className="w-full">
            <div className="space-y-2">
                {styles.map((style) => (
                    <button
                        key={style.value}
                        onClick={() => onStyleChange(style.value)}
                        className={`w-full p-4 rounded-md border transition-colors text-left cursor-pointer ${
                            selectedStyle === style.value
                                ? "border-[#3B82F6] bg-[#3B82F6]/10"
                                : "border-[#3A3A3A] hover:border-[#3B82F6]/50 bg-[#1E1E1E]"
                        }`}
                    >
                        <div className="font-medium text-[#F3F4F6]">
                            {style.label}
                        </div>
                        <div className="text-sm text-gray-400 mt-1">
                            {style.description}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};
