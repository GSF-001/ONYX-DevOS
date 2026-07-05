import { useState } from "react";
import { RepositoryHeader } from "./RepositoryHeader";
import { Branches } from "./Branches";
import { Commits } from "./Commits";
import { Contributors } from "./Contributors";
import { Releases } from "./Releases";
import { Tags } from "./Tags";
import { Statistics } from "./Statistics";
import { EmptyState, LoadingSpinner } from "../../shared/components";
import type { useRepositoryData } from "./RepositoryHooks";

type Tab = "overview" | "branches" | "commits" | "contributors" | "releases" | "tags";

const TABS: { id: Tab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "branches", label: "Branches" },
  { id: "commits", label: "Commits" },
  { id: "contributors", label: "Contributors" },
  { id: "releases", label: "Releases" },
  { id: "tags", label: "Tags" },
];

interface RepositoryWindowProps {
  data: ReturnType<typeof useRepositoryData>;
}

export function RepositoryWindow({ data }: RepositoryWindowProps) {
  const [tab, setTab] = useState<Tab>("overview");

  if (data.loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: 48 }}>
        <LoadingSpinner label="Loading repository..." />
      </div>
    );
  }

  if (data.error || !data.repository) {
    return <EmptyState title="Couldn't load repository" description={data.error ?? "Unknown error"} />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <RepositoryHeader repository={data.repository} />
      <div style={{ display: "flex", borderBottom: "1px solid var(--win-face-dark)" }}>
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="win-button"
            style={{
              width: "auto",
              padding: "6px 12px",
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
        {tab === "overview" && <Statistics repository={data.repository} />}
        {tab === "branches" && <Branches />}
        {tab === "commits" && <Commits />}
        {tab === "contributors" && <Contributors contributors={data.contributors} />}
        {tab === "releases" && <Releases />}
        {tab === "tags" && <Tags />}
      </div>
    </div>
  );
}
