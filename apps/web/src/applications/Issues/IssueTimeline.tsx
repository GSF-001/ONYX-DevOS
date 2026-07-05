// Issues/IssueTimeline.tsx
import { EmptyState } from "../../shared/components";

/** Unlike PRs (which have a real /timeline endpoint via reviews +
 * merge/close events), issues have no comparable event history endpoint. */
export function IssueTimeline() {
  return (
    <EmptyState
      title="Issue timeline isn't available yet"
      description="Pull requests have a real timeline endpoint (opens/reviews/merges). Issues don't have an equivalent yet — would need an issue-comments/events sync."
    />
  );
}
