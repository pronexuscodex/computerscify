import type { ResearchCache, ResearchProviderResult } from '../types/researchProvider';

interface CacheEntry {
  expiresAt: number;
  value: ResearchProviderResult;
}

export class MemoryResearchCache implements ResearchCache {
  private readonly entries = new Map<string, CacheEntry>();

  constructor(private readonly now: () => number = () => Date.now()) {}

  get(key: string): ResearchProviderResult | undefined {
    const entry = this.entries.get(key);
    if (!entry) return undefined;
    if (entry.expiresAt <= this.now()) {
      this.entries.delete(key);
      return undefined;
    }
    return { ...entry.value, fromCache: true };
  }

  set(key: string, value: ResearchProviderResult, ttlMs: number): void {
    this.entries.set(key, {
      expiresAt: this.now() + Math.max(0, ttlMs),
      value: { ...value, fromCache: false },
    });
  }

  delete(key: string): void {
    this.entries.delete(key);
  }
}

export class LocalStorageResearchCache implements ResearchCache {
  constructor(
    private readonly prefix = 'computerscify:research:v1:',
    private readonly now: () => number = () => Date.now()
  ) {}

  get(key: string): ResearchProviderResult | undefined {
    if (typeof localStorage === 'undefined') return undefined;
    try {
      const raw = localStorage.getItem(`${this.prefix}${key}`);
      if (!raw) return undefined;
      const entry = JSON.parse(raw) as CacheEntry;
      if (entry.expiresAt <= this.now()) {
        localStorage.removeItem(`${this.prefix}${key}`);
        return undefined;
      }
      return { ...entry.value, fromCache: true };
    } catch {
      return undefined;
    }
  }

  set(key: string, value: ResearchProviderResult, ttlMs: number): void {
    if (typeof localStorage === 'undefined') return;
    try {
      const entry: CacheEntry = {
        expiresAt: this.now() + Math.max(0, ttlMs),
        value: { ...value, fromCache: false },
      };
      localStorage.setItem(`${this.prefix}${key}`, JSON.stringify(entry));
    } catch {
      // Metadata caching is an optimization; quota/privacy failures must not break research browsing.
    }
  }

  delete(key: string): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(`${this.prefix}${key}`);
    }
  }
}
