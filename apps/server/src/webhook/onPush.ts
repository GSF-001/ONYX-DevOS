import { db } from "../db/client.js";
import { commits } from "../db/schema.js";
import { getRepositoryByFullName } from "../db/queries.js";
import type { ParsedWebhookEvent } from "./parser.js";
import { cache } from "../services/cache.js";
import { logger } from "../services/logger.js";

interface PushCommit {
  id: string;
  message: string;
  timestamp: string;
  author: { username?: string; email?: string };
  added: string[];
  removed: string[];
  modified: string[];
}

export async function handlePush(event: ParsedWebhookEvent): Promise<void> {
  const repoFullName = event.repositoryFullName;
  if (!repoFullName) return;

  const repo = await getRepositoryByFullName(repoFullName);
  if (!repo) {
    logger.warn({ repoFullName }, "Push event for unknown repository, ignoring");
    return;
  }

  const pushCommits = (event.raw.commits as PushCommit[] | undefined) ?? [];

  for (const commit of pushCommits) {
    await db
      .insert(commits)
      .values({
        repositoryId: repo.id,
        sha: commit.id,
        authorLogin: commit.author?.username ?? null,
        authorEmail: commit.author?.email ?? null,
        message: commit.message,
        additions: commit.added.length,
        deletions: commit.removed.length,
        committedAt: new Date(commit.timestamp),
      })
      .onConflictDoNothing({ target: commits.sha });
  }

  cache.invalidatePrefix(`analytics:${repo.id}:`);
}
