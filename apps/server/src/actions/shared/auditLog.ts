import { appendFile, mkdir } from "fs/promises";
import { dirname } from "path";

export interface AuditEntry {
  actorId: string;
  githubLogin: string;
  action: string;
  target: string;
  result: "success" | "failure";
  errorMessage?: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

/**
 * Stage-1 audit sink: in-memory ring buffer + append-only local JSONL file.
 *
 * This module intentionally exposes a small, stable interface
 * (recordAudit / getRecentAuditEntries) so the storage backend can be
 * swapped for a database + Redis without touching any call sites in
 * pulls/, issues/, repository/, or releases/.
 */

const MAX_IN_MEMORY_ENTRIES = 500;
const LOG_FILE_PATH = process.env.GITHUB_ACTIONS_AUDIT_LOG_PATH ?? "./.data/audit/github-write-actions.jsonl";

const ringBuffer: AuditEntry[] = [];
let dirEnsured = false;

async function ensureLogDir(): Promise<void> {
  if (dirEnsured) return;
  await mkdir(dirname(LOG_FILE_PATH), { recursive: true });
  dirEnsured = true;
}

export async function recordAudit(entry: AuditEntry): Promise<void> {
  ringBuffer.push(entry);
  if (ringBuffer.length > MAX_IN_MEMORY_ENTRIES) {
    ringBuffer.shift();
  }

  try {
    await ensureLogDir();
    await appendFile(LOG_FILE_PATH, JSON.stringify(entry) + "\n", "utf8");
  } catch (err) {
    // Audit logging must never take down a write action. Surface the
    // failure to stderr so it's visible in process logs / monitoring.
    // eslint-disable-next-line no-console
    console.error("[auditLog] failed to persist audit entry to disk:", err);
  }
}

export function getRecentAuditEntries(limit = 100): AuditEntry[] {
  return ringBuffer.slice(-limit);
}

/**
 * Small helper so every action can log success/failure with one call
 * instead of duplicating timestamp/shape logic everywhere.
 */
export async function recordActionResult(params: {
  actor: { userId: string; githubLogin: string };
  action: string;
  target: string;
  error?: unknown;
  metadata?: Record<string, unknown>;
}): Promise<void> {
  const { actor, action, target, error, metadata } = params;
  await recordAudit({
    actorId: actor.userId,
    githubLogin: actor.githubLogin,
    action,
    target,
    result: error ? "failure" : "success",
    errorMessage: error instanceof Error ? error.message : error ? String(error) : undefined,
    timestamp: new Date().toISOString(),
    metadata,
  });
}
