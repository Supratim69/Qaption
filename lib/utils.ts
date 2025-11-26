import { Caption } from "./types";

/**
 * Format time in seconds to MM:SS format
 */
export function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
}

/**
 * Convert captions to SRT format
 */
export function captionsToSRT(captions: Caption[]): string {
    return captions
        .map((caption, index) => {
            const startTime = formatSRTTime(caption.start);
            const endTime = formatSRTTime(caption.end);
            return `${index + 1}\n${startTime} --> ${endTime}\n${
                caption.text
            }\n`;
        })
        .join("\n");
}

/**
 * Format time for SRT (HH:MM:SS,mmm)
 */
function formatSRTTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const milliseconds = Math.floor((seconds % 1) * 1000);

    return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${secs.toString().padStart(2, "0")},${milliseconds
        .toString()
        .padStart(3, "0")}`;
}

/**
 * Convert captions to VTT format
 */
export function captionsToVTT(captions: Caption[]): string {
    const header = "WEBVTT\n\n";
    const content = captions
        .map((caption) => {
            const startTime = formatVTTTime(caption.start);
            const endTime = formatVTTTime(caption.end);
            return `${startTime} --> ${endTime}\n${caption.text}\n`;
        })
        .join("\n");
    return header + content;
}

/**
 * Format time for VTT (HH:MM:SS.mmm)
 */
function formatVTTTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const milliseconds = Math.floor((seconds % 1) * 1000);

    return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${secs.toString().padStart(2, "0")}.${milliseconds
        .toString()
        .padStart(3, "0")}`;
}

/**
 * Download captions as a file
 */
export function downloadCaptions(
    captions: Caption[],
    format: "srt" | "vtt",
    filename: string
): void {
    const content =
        format === "srt" ? captionsToSRT(captions) : captionsToVTT(captions);
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/**
 * Get video duration from file
 */
export function getVideoDuration(file: File): Promise<number> {
    return new Promise((resolve, reject) => {
        const video = document.createElement("video");
        video.preload = "metadata";

        video.onloadedmetadata = () => {
            window.URL.revokeObjectURL(video.src);
            resolve(video.duration);
        };

        video.onerror = () => {
            reject(new Error("Failed to load video metadata"));
        };

        video.src = URL.createObjectURL(file);
    });
}
