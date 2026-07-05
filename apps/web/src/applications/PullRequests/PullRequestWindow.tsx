import { useState } from "react";
import type { PullRequest } from "./PullRequestTypes";
import type { usePullRequestData } from "./PullRequestHooks";
import { OpenPR } from "./OpenPR";
import { DraftPR } from "./DraftPR";
import { MergedPR } from "./MergedPR";
import { ClosedPR } from "./ClosedPR";
import { WaitingReview } from "./WaitingReview";
import { PullRequestTimeline } from "./Timeline";
import { EmptyState, LoadingSpinner } from "../../shared/components";

type Tab = "open" | "waiting" | "merged" | "closed" | "draft" | "all";

const TABS: { id: Tab; label: string }[] = [
  { id: "open", label: "Open" },
  { id: "waiting", label: "Waiting Review" },
  { id: "merged", label: "Merged" },
  { id: "closed", label: "Closed" },
  { id: "draft", label: "Draft" },
  { id: "all", label: "All" },
];

interface PullRequestWindowProps {
  data: ReturnType<typeof usePullRequestData>;
}

export function PullRequestWindow({ data }: PullRequestWindowProps) {
  const [tab, setTab] = useState<Tab>("open");
  const [selected, setSelected] = useState<PullRequest | null>(null);

  if (data.loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: 48 }}>
        <LoadingSpinner label="Loading pull requests..." />
      </div>
    );
  }

  if (data.error) {
    return <EmptyState title="Couldn't load pull requests" description={data.error} />;
  }

  return (
    <div style={{ display: "flex", height: "100%" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", borderRight: "1px solid var(--win-face-dark)" }}>
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
          {tab === "open" && <OpenPR pullRequests={data.pullRequests} onOpen={setSelected} />}
          {tab === "waiting" && <WaitingReview pullRequests={data.pullRequests} onOpen={setSelected} />}
          {tab === "merged" && <MergedPR pullRequests={data.pullRequests} onOpen={setSelected} />}
          {tab === "closed" && <ClosedPR pullRequests={data.pullRequests} onOpen={setSelected} />}
          {tab === "draft" && <DraftPR />}
          {tab === "all" && <OpenPR pullRequests={data.pullRequests} onOpen={setSelected} />}
        </div>
      </div>

      <div style={{ width: 280, padding: 12, overflowY: "auto" }}>
        {selected ? (
          <>
            <p style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>
              #{selected.number} {selected.title}
            </p>
            <PullRequestTimeline pullRequestId={selected.id} />
          </>
        ) : (
          <EmptyState title="No PR selected" description="Click a pull request to see its timeline." />
        )}
      </div>
    </div>
  );
}
