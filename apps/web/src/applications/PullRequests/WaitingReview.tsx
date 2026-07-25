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

// PullRequests/WaitingReview.tsx
import type { PullRequest } from "./PullRequestTypes";
import { PullRequestList } from "./PullRequestListShared";

export function WaitingReview({ pullRequests, onOpen }: { pullRequests: PullRequest[]; onOpen: (pr: PullRequest) => void }) {
  const waiting = pullRequests.filter((pr) => pr.state === "open" && !pr.firstReviewAt);
  return <PullRequestList pullRequests={waiting} onOpen={onOpen} />;
}
