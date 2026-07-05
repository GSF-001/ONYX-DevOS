import type { RepositoryViewState } from "./RepositoryTypes";
import { EmptyState } from "../../shared/components";
import { formatPercent } from "../../shared/utils";

export function Contributors({ contributors }: { contributors: RepositoryViewState["contributors"] }) {
  if (contributors.length === 0) {
    return <EmptyState title="No commit data yet" description="Sync the repository to pull contributor activity." />;
  }

  return (
    <div style={{ padding: 12 }}>
      {contributors.map((c) => (
        <div key={c.authorLogin} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid var(--win-face-dark)", fontSize: 13 }}>
          <span>{c.authorLogin}</span>
          <span style={{ color: "var(--win-text-dim)" }}>
            {c.commitCount} commits · {formatPercent(c.share)}
          </span>
        </div>
      ))}
    </div>
  );
}
