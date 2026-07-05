export type IssueState = "open" | "closed";

export interface Issue {
  id: number;
  repositoryId: number;
  number: number;
  title: string;
  authorLogin: string;
  state: IssueState;
  createdAt: string;
  updatedAt: string;
  closedAt: string | null;
}
