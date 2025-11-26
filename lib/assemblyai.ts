import { AssemblyAI } from "assemblyai";
import { Caption } from "./types";
import { readFile } from "fs/promises";
import path from "path";

const client = new AssemblyAI({
    apiKey: process.env.ASSEMBLYAI_API_KEY || "",
});

export async function transcribeVideo(videoUrl: string): Promise<Caption[]> {
    try {
        console.log("🎤 Starting transcription for:", videoUrl);

        // Check if it's an S3 URL (or any HTTP URL)
        let audioSource: string | Buffer;

        if (videoUrl.startsWith("http")) {
            // S3 URL - check if it's an S3 URL or needs to be read locally
            if (
                videoUrl.includes("s3.amazonaws.com") ||
                videoUrl.includes("s3.")
            ) {
                // Direct S3 URL - AssemblyAI can access it
                console.log("📡 Using S3 URL directly");
                audioSource = videoUrl;
            } else {
                // Other HTTP URL - extract path and read locally
                const url = new URL(videoUrl);
                const relativePath = url.pathname;
                const videoPath = path.join(
                    process.cwd(),
                    "public",
                    relativePath
                );
                console.log("📁 Reading local file from:", videoPath);
                const videoBuffer = await readFile(videoPath);

                console.log("📤 Uploading to AssemblyAI...");
                audioSource = await client.files.upload(videoBuffer);
            }
        } else {
            // Local path - read and upload
            const videoPath = path.join(process.cwd(), "public", videoUrl);
            console.log("📁 Reading local file from:", videoPath);
            const videoBuffer = await readFile(videoPath);

            console.log("📤 Uploading to AssemblyAI...");
            audioSource = await client.files.upload(videoBuffer);
        }

        console.log("🔄 Starting transcription...");

        // Start transcription with word-level timestamps
        const transcript = await client.transcripts.transcribe({
            audio: audioSource,
            language_code: "en", // AssemblyAI auto-detects but we can specify
            word_boost: ["Hindi", "Hinglish"], // Boost Hindi/Hinglish words
            format_text: true,
        });

        if (transcript.status === "error") {
            throw new Error(`Transcription failed: ${transcript.error}`);
        }

        // Convert words to captions (group by sentences or time chunks)
        const captions: Caption[] = [];

        if (transcript.words && transcript.words.length > 0) {
            let currentCaption: Caption = {
                id: "0",
                start: transcript.words[0].start / 1000, // Convert ms to seconds
                end: transcript.words[0].end / 1000,
                text: transcript.words[0].text,
            };

            for (let i = 1; i < transcript.words.length; i++) {
                const word = transcript.words[i];
                const wordStart = word.start / 1000;
                const wordEnd = word.end / 1000;

                // Group words into captions (max 5 seconds or 10 words per caption)
                if (
                    wordStart - currentCaption.start > 5 ||
                    currentCaption.text.split(" ").length >= 10
                ) {
                    captions.push(currentCaption);
                    currentCaption = {
                        id: captions.length.toString(),
                        start: wordStart,
                        end: wordEnd,
                        text: word.text,
                    };
                } else {
                    currentCaption.text += " " + word.text;
                    currentCaption.end = wordEnd;
                }
            }

            // Push the last caption
            if (currentCaption.text) {
                captions.push(currentCaption);
            }
        }

        return captions;
    } catch (error) {
        console.error("Transcription error:", error);
        throw error;
    }
}

export async function getTranscriptionStatus(transcriptId: string) {
    const transcript = await client.transcripts.get(transcriptId);
    return transcript;
}
