import { listOpenIssuesForRepo } from "../db/queries.js";

export interface GraveyardIssue {
  id: number;
  number: number;
  title: string;
  authorLogin: string;
  ageDays: number;
}

export async function computeIssueGraveyard(
  repositoryId: number,
  graveyardDays = 90
): Promise<GraveyardIssue[]> {
  const openIssues = await listOpenIssuesForRepo(repositoryId);
  const now = Date.now();

  return openIssues
    .map((issue) => ({
      id: issue.id,
      number: issue.number,
      title: issue.title,
      authorLogin: issue.authorLogin,
      ageDays: Math.floor((now - issue.createdAt.getTime()) / (24 * 60 * 60 * 1000)),
    }))
    .filter((issue) => issue.ageDays >= graveyardDays)
    .sort((a, b) => b.ageDays - a.ageDays);
}
