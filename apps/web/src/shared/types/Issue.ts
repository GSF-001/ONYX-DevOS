/**
 * ONYX DevOS — Developer Operating System
 * © 2026 GSF-001
 *
 * Proprietary Software.
 * Unauthorized use is strictly prohibited.
 */

/**
 * ONYX DevOS
 * Copyright (c) 2026 GSF-001
 * All rights reserved.
 */

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
