// Simple API client for TypingTest Spring backend
// Endpoints expected:
// GET /typing-tests/{userId} -> TypingTest[]
// POST /typing-tests -> saves a TypingTest

export interface TypingTestRecord {
    id?: string;
    userId: string;
    wordsPerMinute: number;
    accuracy: number;
}

const API_BASE_URL = '/api';

const withBase = (path: string) => `${API_BASE_URL.replace(/\/$/, '')}${path.startsWith('/') ? '' : '/'}${path}`;

export function getOrCreateUserId(storageKey = 'typing_test_user_id'): string {
    if (typeof window === 'undefined') return 'server-user';
    try {
        let id = window.localStorage.getItem(storageKey);
        if (!id) {
            // Prefer crypto.randomUUID if available
            if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
                id = crypto.randomUUID();
            } else {
                // Fallback simple random string
                id = `user_${Math.random().toString(36).slice(2)}_${Date.now().toString(36)}`;
            }
            window.localStorage.setItem(storageKey, id);
        }
        return id;
    } catch {
        // As a last resort, generate ephemeral id (won't persist)
        return `ephemeral_${Math.random().toString(36).slice(2)}_${Date.now().toString(36)}`;
    }
}

export async function fetchScores(userId: string): Promise<TypingTestRecord[]> {
    const res = await fetch(withBase(`/typing-tests/${encodeURIComponent(userId)}`), {
        method: 'GET',
    });
    if (!res.ok) {
        throw new Error(`Failed to fetch scores: ${res.status} ${res.statusText}`);
    }
    return res.json();
}

export async function submitScore(record: TypingTestRecord): Promise<TypingTestRecord> {
    const res = await fetch(withBase('/typing-tests'), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(record),
    });
    if (!res.ok) {
        throw new Error(`Failed to submit score: ${res.status} ${res.statusText}`);
    }
    return res.json();
}
