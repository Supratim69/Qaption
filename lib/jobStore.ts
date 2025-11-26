// In-memory store for job updates (use Redis in production)
const jobUpdates = new Map<string, any>();
const subscribers = new Map<string, Set<(data: any) => void>>();

export function subscribeToJob(jobId: string, callback: (data: any) => void) {
    if (!subscribers.has(jobId)) {
        subscribers.set(jobId, new Set());
    }
    subscribers.get(jobId)!.add(callback);

    // Send initial status if available
    const status = jobUpdates.get(jobId);
    if (status) {
        callback(status);
    }

    return () => {
        const subs = subscribers.get(jobId);
        if (subs) {
            subs.delete(callback);
            if (subs.size === 0) {
                subscribers.delete(jobId);
            }
        }
    };
}

export function updateJobStatus(jobId: string, status: any) {
    jobUpdates.set(jobId, status);

    // Notify all subscribers
    const subs = subscribers.get(jobId);
    if (subs) {
        subs.forEach((callback) => callback(status));
    }
}

export function getJobStatus(jobId: string) {
    return jobUpdates.get(jobId);
}
