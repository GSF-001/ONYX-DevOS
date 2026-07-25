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

import { getPullRequestTimeline, getPullRequests } from "../../shared/api";
import type { PullRequestState } from "../../shared/types";

export const PullRequestAPI = {
  list: (repositoryId: number, state?: PullRequestState) => getPullRequests(repositoryId, state),
  timeline: (repositoryId: number, pullRequestId: number) =>
    getPullRequestTimeline(repositoryId, pullRequestId),
};
