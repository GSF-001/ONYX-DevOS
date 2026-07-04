import { db } from "../db/client.js";
import { issues } from "../db/schema.js";
import { getRepositoryByFullName } from "../db/queries.js";
import type { ParsedWebhookEvent } from "./parser.js";
import { cache } from "../services/cache.js";
import { logger } from "../services/logger.js";

interface GhIssuePayload {
  id: number;
  number: number;
  title: string;
  user: { login: string };
  state: "open" | "closed";
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  pull_request?: unknown;
}

export async function handleIssue(event: ParsedWebhookEvent): Promise<void> {
  const repoFullName = event.repositoryFullName;
  if (!repoFullName) return;

  const issue = event.raw.issue as GhIssuePayload | undefined;
  if (!issue || issue.pull_request) return;

  const repo = await getRepositoryByFullName(repoFullName);
  if (!repo) {
    logger.warn({ repoFullName }, "issues event for unknown repository, ignoring");
    return;
  }

  await db
    .insert(issues)
    .values({
      repositoryId: repo.id,
      githubIssueId: issue.id,
      number: issue.number,
      title: issue.title,
      authorLogin: issue.user.login,
      state: issue.state,
      createdAt: new Date(issue.created_at),
      updatedAt: new Date(issue.updated_at),
      closedAt: issue.closed_at ? new Date(issue.closed_at) : null,
    })
    .onConflictDoUpdate({
      target: issues.githubIssueId,
      set: {
        title: issue.title,
        state: issue.state,
        updatedAt: new Date(issue.updated_at),
        closedAt: issue.closed_at ? new Date(issue.closed_at) : null,
      },
    });

  cache.invalidatePrefix(`analytics:${repo.id}:`);
}
