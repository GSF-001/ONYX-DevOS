// StatusBar.tsx
import { useCurrentBranch, useGitGraphState, useSelectedCommit } from "./GitGraphHooks";
import { shortHash } from "./GitGraphAPI";

export default function StatusBar() {
  const { commits, branches } = useGitGraphState();
  const currentBranch = useCurrentBranch();
  const selectedCommit = useSelectedCommit();

  return (
    <footer className="git-graph-status-bar">
      <span className="git-graph-status-item">
        <span className="git-graph-status-dot" style={{ background: currentBranch?.color ?? "#888" }} />
        {currentBranch ? currentBranch.name : "detached HEAD"}
      </span>
      <span className="git-graph-status-item">{commits.length} commits</span>
      <span className="git-graph-status-item">{branches.length} branches</span>
      <span className="git-graph-status-item git-graph-status-selection">
        {selectedCommit
          ? `Selected ${shortHash(selectedCommit.hash)} — ${selectedCommit.message}`
          : "No commit selected"}
      </span>
    </footer>
  );
}
