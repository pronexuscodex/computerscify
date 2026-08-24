const STORAGE_KEY = 'computerfy_news_read_ids';
const MAX_TRACKED = 500;

/**
 * Tracks which news items a learner has already opened, purely client-side (local-first, no
 * accounts — same philosophy as the rest of the app's storage). Read state is cosmetic (dims a
 * headline once opened, like Feedly/Gmail), so a failure to persist here is never fatal.
 */
export function loadReadIds(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? new Set(parsed) : new Set();
  } catch {
    return new Set();
  }
}

export function persistReadIds(ids: Set<string>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(ids).slice(-MAX_TRACKED)));
  } catch {
    // localStorage can be unavailable (private browsing) or full — not required for the feed to work.
  }
}
