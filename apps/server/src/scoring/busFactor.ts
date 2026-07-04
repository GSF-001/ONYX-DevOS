import { listCommitsForRepoSince } from "../db/queries.js";

export interface BusFactorResult {
  busFactor: number;
  contributions: { authorLogin: string; commitCount: number; share: number }[];
  herfindahlIndex: number;
}

export async function computeBusFactor(
  repositoryId: number,
  windowDays = 90
): Promise<BusFactorResult> {
  const since = new Date(Date.now() - windowDays * 24 * 60 * 60 * 1000);
  const commitRows = await listCommitsForRepoSince(repositoryId, since);

  const counts = new Map<string, number>();
  for (const commit of commitRows) {
    if (!commit.authorLogin) continue;
    counts.set(commit.authorLogin, (counts.get(commit.authorLogin) ?? 0) + 1);
  }

  const total = commitRows.length;
  const contributions = Array.from(counts.entries())
    .map(([authorLogin, commitCount]) => ({
      authorLogin,
      commitCount,
      share: total > 0 ? commitCount / total : 0,
    }))
    .sort((a, b) => b.commitCount - a.commitCount);

  let cumulative = 0;
  let busFactor = 0;
  for (const contributor of contributions) {
    cumulative += contributor.share;
    busFactor += 1;
    if (cumulative >= 0.5) break;
  }

  const herfindahlIndex = contributions.reduce((sum, c) => sum + c.share * c.share, 0);

  return { busFactor, contributions, herfindahlIndex };
}
