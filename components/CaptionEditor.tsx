"use client";

import React from "react";
import { Caption } from "@/lib/types";

interface CaptionEditorProps {
    captions: Caption[];
    onCaptionsChange: (captions: Caption[]) => void;
}

export const CaptionEditor: React.FC<CaptionEditorProps> = ({
    captions,
    onCaptionsChange,
}) => {
    const handleTextChange = (id: string, newText: string) => {
        const updatedCaptions = captions.map((caption) =>
            caption.id === id ? { ...caption, text: newText } : caption
        );
        onCaptionsChange(updatedCaptions);
    };

    const handleTimeChange = (
        id: string,
        field: "start" | "end",
        value: string
    ) => {
        const numValue = parseFloat(value);
        if (isNaN(numValue)) return;

        const updatedCaptions = captions.map((caption) =>
            caption.id === id ? { ...caption, [field]: numValue } : caption
        );
        onCaptionsChange(updatedCaptions);
    };

    const handleDelete = (id: string) => {
        const updatedCaptions = captions.filter((caption) => caption.id !== id);
        onCaptionsChange(updatedCaptions);
    };

    if (captions.length === 0) {
        return (
            <div className="text-center py-8 text-sm text-gray-500">
                No captions available
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="space-y-3 max-h-96 overflow-y-auto">
                {captions.map((caption) => (
                    <div
                        key={caption.id}
                        className="p-4 border border-[#3A3A3A] rounded-md bg-[#1E1E1E]"
                    >
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex gap-4 text-sm">
                                <div>
                                    <label className="block text-xs text-gray-400 mb-1">
                                        Start (s)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={caption.start.toFixed(2)}
                                        onChange={(e) =>
                                            handleTimeChange(
                                                caption.id,
                                                "start",
                                                e.target.value
                                            )
                                        }
                                        className="w-20 px-2 py-1.5 border border-[#3A3A3A] rounded text-sm focus:outline-none focus:border-[#3B82F6] bg-[#2D2D2D] text-[#F3F4F6]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-400 mb-1">
                                        End (s)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={caption.end.toFixed(2)}
                                        onChange={(e) =>
                                            handleTimeChange(
                                                caption.id,
                                                "end",
                                                e.target.value
                                            )
                                        }
                                        className="w-20 px-2 py-1.5 border border-[#3A3A3A] rounded text-sm focus:outline-none focus:border-[#3B82F6] bg-[#2D2D2D] text-[#F3F4F6]"
                                    />
                                </div>
                            </div>
                            <button
                                onClick={() => handleDelete(caption.id)}
                                className="text-sm text-gray-400 hover:text-red-400 transition-colors cursor-pointer"
                            >
                                Delete
                            </button>
                        </div>
                        <textarea
                            value={caption.text}
                            onChange={(e) =>
                                handleTextChange(caption.id, e.target.value)
                            }
                            className="w-full px-3 py-2 border border-[#3A3A3A] rounded-md focus:outline-none focus:border-[#3B82F6] font-sans text-sm bg-[#2D2D2D] text-[#F3F4F6]"
                            rows={2}
                            style={{
                                fontFamily:
                                    "'Inter', 'Noto Sans Devanagari', sans-serif",
                            }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};
