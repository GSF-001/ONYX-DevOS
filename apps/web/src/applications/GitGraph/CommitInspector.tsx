// CommitInspector.tsx
import { useSelectedCommit, useGitGraphState } from "./GitGraphHooks";
import { selectFile } from "./GitGraphCommands";
import { shortHash, formatTimestamp } from "./GitGraphAPI";

const STATUS_LABEL: Record<string, string> = {
  added: "A",
  modified: "M",
  deleted: "D",
  renamed: "R",
};

export default function CommitInspector() {
  const commit = useSelectedCommit();
  const { selectedFilePath } = useGitGraphState();

  if (!commit) {
    return (
      <section className="commit-inspector empty">
        <p>Select a commit to inspect its details.</p>
      </section>
    );
  }

  return (
    <section className="commit-inspector">
      <header className="commit-inspector-header">
        <h2 className="commit-inspector-message">{commit.message}</h2>
        <div className="commit-inspector-meta">
          <span className="git-mono">{shortHash(commit.hash)}</span>
          <span>{commit.author}</span>
          <span>{formatTimestamp(commit.timestamp)}</span>
          <span className="commit-inspector-branch-badge">{commit.branch}</span>
        </div>
        {commit.parents.length > 0 && (
          <div className="commit-inspector-parents">
            Parents:{" "}
            {commit.parents.map((p) => (
              <span key={p} className="git-mono commit-inspector-parent-hash">
                {shortHash(p)}
              </span>
            ))}
          </div>
        )}
      </header>

      <div className="commit-inspector-files">
        <h3 className="commit-inspector-files-heading">
          Changed files ({commit.changedFiles.length})
        </h3>
        {commit.changedFiles.length === 0 && (
          <p className="commit-inspector-no-files">No file changes recorded for this commit.</p>
        )}
        <ul className="commit-inspector-file-list">
          {commit.changedFiles.map((file) => (
            <li key={file.path}>
              <button
                className={
                  file.path === selectedFilePath
                    ? "commit-inspector-file-button active"
                    : "commit-inspector-file-button"
                }
                onClick={() => selectFile(file.path)}
              >
                <span className={`commit-inspector-file-status status-${file.status}`}>
                  {STATUS_LABEL[file.status]}
                </span>
                <span className="commit-inspector-file-path">{file.path}</span>
                <span className="commit-inspector-file-stats">
                  <span className="stat-add">+{file.additions}</span>{" "}
                  <span className="stat-remove">-{file.deletions}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
