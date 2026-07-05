import type { useInsightsData } from "./InsightsHooks";
import { MergeWithoutReview } from "./MergeWithoutReview";
import { BusFactor } from "./BusFactor";
import { CommitDecay } from "./CommitDecay";
import { ReviewHealth } from "./ReviewHealth";
import { ReviewerGap } from "./ReviewerGap";
import { IssueGraveyard } from "./IssueGraveyard";
import { WeekendHeatmap } from "./WeekendHeatmap";
import { EmptyState, LoadingSpinner } from "../../shared/components";

interface Panel {
  title: string;
  render: (insights: NonNullable<ReturnType<typeof useInsightsData>["insights"]>) => JSX.Element;
}

const PANELS: Panel[] = [
  { title: "Review Health", render: (i) => <ReviewHealth data={i.reviewHealth} /> },
  { title: "Bus Factor", render: (i) => <BusFactor data={i.busFactor} /> },
  { title: "Merge Without Review", render: (i) => <MergeWithoutReview data={i.mergeWithoutReview} /> },
  { title: "Commit Decay", render: (i) => <CommitDecay data={i.commitDecay} /> },
  { title: "Review Reciprocity", render: (i) => <ReviewerGap data={i.reciprocityGap} /> },
  { title: "Issue Graveyard", render: (i) => <IssueGraveyard data={i.issueGraveyard} /> },
];

export function InsightsWindow({ data }: { data: ReturnType<typeof useInsightsData> }) {
  if (data.loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: 48 }}>
        <LoadingSpinner label="Computing insights..." />
      </div>
    );
  }
  if (data.error || !data.insights) {
    return <EmptyState title="Couldn't load insights" description={data.error ?? "Unknown error"} />;
  }

  const insights = data.insights;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, padding: 12, overflowY: "auto", height: "100%" }}>
      {PANELS.map((panel) => (
        <div key={panel.title} className="win-frame" style={{ minHeight: 140 }}>
          <p style={{ fontSize: 11, fontWeight: 700, padding: "8px 12px 0", color: "var(--win-text-dim)" }}>
            {panel.title.toUpperCase()}
          </p>
          {panel.render(insights)}
        </div>
      ))}
      <div className="win-frame" style={{ gridColumn: "1 / -1" }}>
        <p style={{ fontSize: 11, fontWeight: 700, padding: "8px 12px 0", color: "var(--win-text-dim)" }}>
          WEEKEND ACTIVITY HEATMAP
        </p>
        <div style={{ padding: 12 }}>
          <WeekendHeatmap data={insights.weekendHeatmap} />
        </div>
      </div>
    </div>
  );
}
