// DiffPreview.tsx
import { useSelectedFileDiff } from "./GitGraphHooks";

export default function DiffPreview() {
  const diff = useSelectedFileDiff();

  if (!diff) {
    return (
      <section className="diff-preview empty">
        <p>Select a changed file to preview its diff.</p>
      </section>
    );
  }

  return (
    <section className="diff-preview">
      <header className="diff-preview-header">
        <span className="git-mono diff-preview-path">{diff.path}</span>
        <span className="diff-preview-stats">
          <span className="stat-add">+{diff.additions}</span>{" "}
          <span className="stat-remove">-{diff.deletions}</span>
        </span>
      </header>
      <div className="diff-preview-body git-mono">
        {diff.lines.map((line, idx) => (
          <div key={idx} className={`diff-preview-line diff-line-${line.type}`}>
            <span className="diff-preview-line-number old">{line.oldLineNumber ?? ""}</span>
            <span className="diff-preview-line-number new">{line.newLineNumber ?? ""}</span>
            <span className="diff-preview-line-marker">
              {line.type === "add" ? "+" : line.type === "remove" ? "-" : " "}
            </span>
            <span className="diff-preview-line-content">{line.content}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
