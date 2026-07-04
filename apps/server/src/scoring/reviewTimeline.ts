import { eq } from "drizzle-orm";
import { db } from "../db/client.js";
import { pullRequests } from "../db/schema.js";
import { listReviewsForPullRequest } from "../db/queries.js";

export interface TimelineEvent {
  type: "opened" | "reviewed" | "merged" | "closed";
  actor: string;
  at: Date;
  detail?: string;
}

export async function computeReviewTimeline(pullRequestId: number): Promise<TimelineEvent[]> {
  const [pr] = await db.select().from(pullRequests).where(eq(pullRequests.id, pullRequestId));
  if (!pr) return [];

  const events: TimelineEvent[] = [
    { type: "opened", actor: pr.authorLogin, at: pr.createdAt },
  ];

  const reviewRows = await listReviewsForPullRequest(pullRequestId);
  for (const review of reviewRows) {
    events.push({
      type: "reviewed",
      actor: review.reviewerLogin,
      at: review.submittedAt,
      detail: review.state,
    });
  }

  if (pr.mergedAt) {
    events.push({ type: "merged", actor: pr.authorLogin, at: pr.mergedAt });
  } else if (pr.closedAt) {
    events.push({ type: "closed", actor: pr.authorLogin, at: pr.closedAt });
  }

  return events.sort((a, b) => a.at.getTime() - b.at.getTime());
}
