// PullRequests/ClosedPR.tsx
import type { PullRequest } from "./PullRequestTypes";
import { PullRequestList } from "./PullRequestListShared";

export function ClosedPR({ pullRequests, onOpen }: { pullRequests: PullRequest[]; onOpen: (pr: PullRequest) => void }) {
  return <PullRequestList pullRequests={pullRequests.filter((pr) => pr.state === "closed")} onOpen={onOpen} />;
}
