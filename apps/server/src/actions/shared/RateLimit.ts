import { GithubClientError } from "./githubWriteClient";

export class RateLimitExceededError extends GithubClientError {
  constructor(message: string, public retryAfterMs: number) {
    super(message);
    this.name = "RateLimitExceededError";
  }
}

interface WindowEntry {
  timestamps: number[];
}

/**
 * Stage-1 rate limiter: in-memory sliding window keyed by
 * `${userId}:${action}`. Swappable for Redis (INCR + PEXPIRE or a
 * sorted-set sliding window) without changing call sites — only this
 * file needs to change.
 */
const store = new Map<string, WindowEntry>();

export interface RateLimitConfig {
  /** Max calls allowed within the window */
  limit: number;
  /** Window size in milliseconds */
  windowMs: number;
}

// Sensible per-action defaults; can be overridden per call site.
export const DEFAULT_RATE_LIMITS: Record<string, RateLimitConfig> = {
  default: { limit: 30, windowMs: 60_000 },
  "pulls.merge": { limit: 10, windowMs: 60_000 },
  "repository.deleteBranch": { limit: 20, windowMs: 60_000 },
  "releases.publish": { limit: 10, windowMs: 60_000 },
};

export function checkRateLimit(userId: string, action: string, config?: RateLimitConfig): void {
  const cfg = config ?? DEFAULT_RATE_LIMITS[action] ?? DEFAULT_RATE_LIMITS.default;
  const key = `${userId}:${action}`;
  const now = Date.now();

  let entry = store.get(key);
  if (!entry) {
    entry = { timestamps: [] };
    store.set(key, entry);
  }

  entry.timestamps = entry.timestamps.filter((ts) => now - ts < cfg.windowMs);

  if (entry.timestamps.length >= cfg.limit) {
    const oldest = entry.timestamps[0];
    const retryAfterMs = cfg.windowMs - (now - oldest);
    throw new RateLimitExceededError(
      `Rate limit exceeded for action '${action}' (user ${userId}): ` +
        `${cfg.limit} calls per ${cfg.windowMs}ms. Retry after ${retryAfterMs}ms.`,
      retryAfterMs
    );
  }

  entry.timestamps.push(now);
}
