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

import type { PullRequest, PullRequestState, TimelineEvent } from "../../shared/types";

export interface PullRequestViewState {
  pullRequests: PullRequest[];
  loading: boolean;
  error: string | null;
}

export type PullRequestFilter = "all" | PullRequestState | "waiting_review";

export type { PullRequest, PullRequestState, TimelineEvent };
