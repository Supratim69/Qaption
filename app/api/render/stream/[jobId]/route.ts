import { NextRequest } from "next/server";
import { subscribeToJob, getJobStatus } from "@/lib/jobStore";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ jobId: string }> }
) {
    const { jobId } = await params;

    // Create Server-Sent Events stream
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
        start(controller) {
            let isClosed = false;
            let closeTimeout: NodeJS.Timeout | null = null;
            let keepAliveInterval: NodeJS.Timeout | null = null;

            const safeClose = () => {
                if (isClosed) return;
                isClosed = true;

                if (closeTimeout) clearTimeout(closeTimeout);
                if (keepAliveInterval) clearInterval(keepAliveInterval);

                try {
                    controller.close();
                } catch (error) {
                    // Already closed, ignore
                }
            };

            // Send initial status if available
            const initialStatus = getJobStatus(jobId);
            if (initialStatus) {
                controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify(initialStatus)}\n\n`)
                );
            }

            // Subscribe to updates
            const unsubscribe = subscribeToJob(jobId, (status) => {
                if (isClosed) return;

                try {
                    controller.enqueue(
                        encoder.encode(`data: ${JSON.stringify(status)}\n\n`)
                    );

                    // Close stream if job is completed or failed
                    if (
                        status.status === "completed" ||
                        status.status === "failed"
                    ) {
                        closeTimeout = setTimeout(() => {
                            unsubscribe();
                            safeClose();
                        }, 1000);
                    }
                } catch (error) {
                    console.error("Error sending SSE:", error);
                    safeClose();
                }
            });

            // Cleanup on connection close
            request.signal.addEventListener("abort", () => {
                unsubscribe();
                safeClose();
            });

            // Keep-alive ping every 15 seconds
            keepAliveInterval = setInterval(() => {
                if (isClosed) {
                    if (keepAliveInterval) clearInterval(keepAliveInterval);
                    return;
                }
                try {
                    controller.enqueue(encoder.encode(": keep-alive\n\n"));
                } catch {
                    safeClose();
                }
            }, 15000);
        },
    });

    return new Response(stream, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
        },
    });
}
