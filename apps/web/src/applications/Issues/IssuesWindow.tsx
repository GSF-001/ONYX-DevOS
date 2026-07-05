import { useState } from "react";
import type { useIssuesData } from "./IssuesHooks";
import { OpenIssues } from "./OpenIssues";
import { ClosedIssues } from "./ClosedIssues";
import { Labels } from "./Labels";
import { Milestones } from "./Milestones";
import { Assignees } from "./Assignees";
import { IssueTimeline } from "./IssueTimeline";
import { EmptyState, LoadingSpinner } from "../../shared/components";

type Tab = "open" | "closed" | "labels" | "milestones" | "assignees" | "timeline";

const TABS: { id: Tab; label: string }[] = [
  { id: "open", label: "Open" },
  { id: "closed", label: "Closed" },
  { id: "labels", label: "Labels" },
  { id: "milestones", label: "Milestones" },
  { id: "assignees", label: "Assignees" },
  { id: "timeline", label: "Timeline" },
];

export function IssuesWindow({ data }: { data: ReturnType<typeof useIssuesData> }) {
  const [tab, setTab] = useState<Tab>("open");

  if (data.loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: 48 }}>
        <LoadingSpinner label="Loading issues..." />
      </div>
    );
  }
  if (data.error) return <EmptyState title="Couldn't load issues" description={data.error} />;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ display: "flex", borderBottom: "1px solid var(--win-face-dark)" }}>
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="win-button"
            style={{
              width: "auto",
              padding: "6px 10px",
              border: "none",
              borderBottom: tab === t.id ? "2px solid var(--win-accent)" : "2px solid transparent",
              background: "transparent",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div style={{ flex: 1, overflowY: "auto" }}>
        {tab === "open" && <OpenIssues graveyard={data.graveyard} />}
        {tab === "closed" && <ClosedIssues />}
        {tab === "labels" && <Labels />}
        {tab === "milestones" && <Milestones />}
        {tab === "assignees" && <Assignees />}
        {tab === "timeline" && <IssueTimeline />}
      </div>
    </div>
  );
}
