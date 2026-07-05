import type { PullRequest, PullRequestState, TimelineEvent } from "../../shared/types";

export interface PullRequestViewState {
  pullRequests: PullRequest[];
  loading: boolean;
  error: string | null;
}

export type PullRequestFilter = "all" | PullRequestState | "waiting_review";

export type { PullRequest, PullRequestState, TimelineEvent };
