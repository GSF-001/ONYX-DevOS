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

// PullRequests/ClosedPR.tsx
import type { PullRequest } from "./PullRequestTypes";
import { PullRequestList } from "./PullRequestListShared";

export function ClosedPR({ pullRequests, onOpen }: { pullRequests: PullRequest[]; onOpen: (pr: PullRequest) => void }) {
  return <PullRequestList pullRequests={pullRequests.filter((pr) => pr.state === "closed")} onOpen={onOpen} />;
}
