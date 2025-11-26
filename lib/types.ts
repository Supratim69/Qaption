export interface Caption {
    id: string;
    start: number;
    end: number;
    text: string;
}

export type CaptionStyle = "bottom-centered" | "top-bar" | "karaoke";

export interface VideoData {
    videoUrl: string;
    captions: Caption[];
    style: CaptionStyle;
    duration: number;
    fps: number;
}

export interface TranscriptionWord {
    text: string;
    start: number;
    end: number;
    confidence: number;
}

export interface TranscriptionResponse {
    id: string;
    status: "queued" | "processing" | "completed" | "error";
    text?: string;
    words?: TranscriptionWord[];
    error?: string;
}
