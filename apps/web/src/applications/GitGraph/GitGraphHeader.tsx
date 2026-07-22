// GitGraphHeader.tsx
import { useCurrentBranch, useGitGraphState } from "./GitGraphHooks";

export default function GitGraphHeader() {
  const { repositoryName } = useGitGraphState();
  const currentBranch = useCurrentBranch();

  return (
    <header className="git-graph-header">
      <div className="git-graph-header-title">
        <span className="git-graph-header-icon" aria-hidden="true">
          ⌥
        </span>
        <span className="git-graph-header-name">{repositoryName}</span>
      </div>
      {currentBranch && (
        <div className="git-graph-header-branch" style={{ borderColor: currentBranch.color }}>
          <span className="git-graph-header-branch-dot" style={{ background: currentBranch.color }} />
          {currentBranch.name}
        </div>
      )}
    </header>
  );
}
