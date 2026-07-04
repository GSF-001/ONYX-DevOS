import { eq, and, gte } from "drizzle-orm";
import { db } from "../db/client.js";
import { pullRequests, reviews } from "../db/schema.js";

export interface MergeWithoutReviewEntry {
  pullRequestId: number;
  number: number;
  title: string;
  authorLogin: string;
  mergedAt: Date | null;
}

export async function computeMergeWithoutReview(
  repositoryId: number,
  windowDays = 30
): Promise<MergeWithoutReviewEntry[]> {
  const since = new Date(Date.now() - windowDays * 24 * 60 * 60 * 1000);

  const merged = await db
    .select()
    .from(pullRequests)
    .where(
      and(
        eq(pullRequests.repositoryId, repositoryId),
        eq(pullRequests.state, "merged"),
        gte(pullRequests.mergedAt, since)
      )
    );

  const result: MergeWithoutReviewEntry[] = [];

  for (const pr of merged) {
    const approvals = await db
      .select()
      .from(reviews)
      .where(and(eq(reviews.pullRequestId, pr.id), eq(reviews.state, "approved")));

    if (approvals.length === 0) {
      result.push({
        pullRequestId: pr.id,
        number: pr.number,
        title: pr.title,
        authorLogin: pr.authorLogin,
        mergedAt: pr.mergedAt,
      });
    }
  }

  return result;
}
