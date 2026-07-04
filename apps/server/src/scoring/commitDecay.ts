import { listCommitsForRepoSince } from "../db/queries.js";

export interface CommitDecayEntry {
  authorLogin: string;
  recentCount: number;
  earlierCount: number;
  decayRatio: number;
  trend: "increasing" | "stable" | "decreasing";
}

export async function computeCommitDecay(
  repositoryId: number,
  windowDays = 60
): Promise<CommitDecayEntry[]> {
  const since = new Date(Date.now() - windowDays * 24 * 60 * 60 * 1000);
  const midpoint = new Date(Date.now() - (windowDays / 2) * 24 * 60 * 60 * 1000);

  const commitRows = await listCommitsForRepoSince(repositoryId, since);

  const byAuthor = new Map<string, { recent: number; earlier: number }>();

  for (const commit of commitRows) {
    if (!commit.authorLogin) continue;
    const bucket = byAuthor.get(commit.authorLogin) ?? { recent: 0, earlier: 0 };
    if (commit.committedAt >= midpoint) bucket.recent += 1;
    else bucket.earlier += 1;
    byAuthor.set(commit.authorLogin, bucket);
  }

  const results: CommitDecayEntry[] = [];
  for (const [authorLogin, { recent, earlier }] of byAuthor) {
    const decayRatio = earlier === 0 ? (recent > 0 ? 2 : 1) : recent / earlier;
    let trend: CommitDecayEntry["trend"] = "stable";
    if (decayRatio > 1.2) trend = "increasing";
    else if (decayRatio < 0.8) trend = "decreasing";

    results.push({ authorLogin, recentCount: recent, earlierCount: earlier, decayRatio, trend });
  }

  return results.sort((a, b) => a.decayRatio - b.decayRatio);
}
