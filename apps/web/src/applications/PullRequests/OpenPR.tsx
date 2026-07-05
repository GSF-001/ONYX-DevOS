// PullRequests/OpenPR.tsx
import type { PullRequest } from "./PullRequestTypes";
import { PullRequestList } from "./PullRequestListShared";

export function OpenPR({ pullRequests, onOpen }: { pullRequests: PullRequest[]; onOpen: (pr: PullRequest) => void }) {
  return <PullRequestList pullRequests={pullRequests.filter((pr) => pr.state === "open")} onOpen={onOpen} />;
}
