import { eq } from "drizzle-orm";
import { db } from "../db/client.js";
import { pullRequests, reviews } from "../db/schema.js";
import { getRepositoryByFullName } from "../db/queries.js";
import type { ParsedWebhookEvent } from "./parser.js";
import { broadcastToRoom } from "../websocket/broadcast.js";
import { cache } from "../services/cache.js";
import { logger } from "../services/logger.js";

interface GhReviewPayload {
  id: number;
  user: { login: string };
  state: string;
  submitted_at: string;
}

interface GhPullRequestRef {
  number: number;
  id: number;
}

export async function handleReview(event: ParsedWebhookEvent): Promise<void> {
  const repoFullName = event.repositoryFullName;
  if (!repoFullName) return;

  const repo = await getRepositoryByFullName(repoFullName);
  if (!repo) {
    logger.warn({ repoFullName }, "pull_request_review event for unknown repository, ignoring");
    return;
  }

  const review = event.raw.review as GhReviewPayload | undefined;
  const prRef = event.raw.pull_request as GhPullRequestRef | undefined;
  if (!review || !prRef) return;

  const [pr] = await db
    .select()
    .from(pullRequests)
    .where(eq(pullRequests.githubPrId, prRef.id));

  if (!pr) {
    logger.warn({ prNumber: prRef.number }, "Review for unknown pull request, ignoring");
    return;
  }

  await db
    .insert(reviews)
    .values({
      pullRequestId: pr.id,
      githubReviewId: review.id,
      reviewerLogin: review.user.login,
      state: review.state.toLowerCase() as
        | "approved"
        | "changes_requested"
        | "commented"
        | "dismissed",
      submittedAt: new Date(review.submitted_at),
    })
    .onConflictDoNothing({ target: reviews.githubReviewId });

  if (!pr.firstReviewAt) {
    await db
      .update(pullRequests)
      .set({ firstReviewAt: new Date(review.submitted_at) })
      .where(eq(pullRequests.id, pr.id));
  }

  cache.invalidatePrefix(`analytics:${repo.id}:`);

  broadcastToRoom(`repository:${repo.id}`, {
    type: "review.created",
    repositoryId: repo.id,
    pullRequestNumber: pr.number,
    reviewer: review.user.login,
    state: review.state,
  });
}
