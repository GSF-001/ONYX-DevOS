/**
 * ONYX DevOS
 * Copyright (c) 2026 GSF-001
 * All rights reserved.
 */

import type { DashboardResponse, ActivityScoreResult, DashboardPrTrendPoint } from "./DashboardTypes";
import type { ActivityFeedEntry, RepositoryInsights } from "../../shared/api/endpoints";
import { buildInsightFeed } from "./DashboardTypes";
import { Timeline, ScoreBar, Badge } from "../../shared/components";
import { formatDateTime, formatRelativeTime } from "../../shared/utils";

interface DashboardOverviewProps {
  repositories: DashboardResponse["repositories"];
  scores: { repositoryId: number; activityScore: ActivityScoreResult }[];
  selectedRepositoryId: number | null;
  trend: DashboardPrTrendPoint[];
  activity: ActivityFeedEntry[];
  insights: RepositoryInsights | null;
  syncing: boolean;
}

/**
 * Unchanged from the original file — kept verbatim per instructions
 * ("TrendChart HARUS dipertahankan, jangan dihapus").
 */
export function TrendChart({ trend }: { trend: DashboardPrTrendPoint[] }) {
  const max = Math.max(1, ...trend.map((p) => Math.max(p.opened, p.merged)));

  return (
    <div>
      <p style={{ fontSize: 11, color: "var(--win-text-dim)", marginBottom: 6 }}>
        PULL REQUESTS — LAST 14 DAYS
      </p>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 60 }}>
        {trend.map((point) => (
          <div key={point.date} style={{ flex: 1, display: "flex", flexDirection: "column", gap: 1 }} title={point.date}>
            <div
              style={{
                height: `${(point.opened / max) * 100}%`,
                background: "var(--win-accent)",
                minHeight: point.opened > 0 ? 2 : 0,
              }}
            />
            <div
              style={{
                height: `${(point.merged / max) * 100}%`,
                background: "var(--win-success)",
                minHeight: point.merged > 0 ? 2 : 0,
              }}
            />
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 12, marginTop: 6, fontSize: 11 }}>
        <span><span style={{ color: "var(--win-accent)" }}>■</span> Opened</span>
        <span><span style={{ color: "var(--win-success)" }}>■</span> Merged</span>
      </div>
    </div>
  );
}

const INSIGHT_SEVERITY_TONE: Record<string, "danger" | "warn" | "neutral"> = {
  high: "danger",
  medium: "warn",
  low: "neutral",
};

export function DashboardOverview({
  repositories,
  scores,
  selectedRepositoryId,
  trend,
  activity,
  insights,
  syncing,
}: DashboardOverviewProps) {
  const selectedRepo = repositories.find((r) => r.id === selectedRepositoryId);
  const selectedScore = scores.find((s) => s.repositoryId === selectedRepositoryId);

  // Same flattening/sorting logic the original file used for the activity feed.
  const flatEvents = activity
    .flatMap((entry) =>
      entry.events.map((event) => ({ ...event, pullRequestNumber: entry.pullRequestNumber }))
    )
    .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
    .slice(0, 10);

  // "Recent Pull Requests" derived from the same ActivityFeedEntry[] the feed
  // already uses — grouped by PR instead of flattened, showing each PR's
  // most recent event. No separate PR-list endpoint is wired into
  // useDashboardData, so this is the only real (non-fabricated) source.
  const recentPullRequests = activity
    .map((entry) => {
      const latest = [...entry.events].sort(
        (a, b) => new Date(b.at).getTime() - new Date(a.at).getTime()
      )[0];
      return { entry, latest };
    })
    .filter((x): x is { entry: ActivityFeedEntry; latest: NonNullable<typeof x.latest> } => Boolean(x.latest))
    .sort((a, b) => new Date(b.latest.at).getTime() - new Date(a.latest.at).getTime())
    .slice(0, 6);

  const openedLast14 = trend.reduce((sum, p) => sum + p.opened, 0);
  const mergedLast14 = trend.reduce((sum, p) => sum + p.merged, 0);
  const contributors = insights?.busFactor.contributions.length ?? null;

  const insightFeed = insights ? buildInsightFeed(insights) : [];

  return (
    <div className="dashboard-layout">
      {/* Repository Summary */}
      <section className="dashboard-section dashboard-summary">
        <p className="dashboard-section-title">REPOSITORY SUMMARY</p>
        <div className="dashboard-summary-grid">
          <div className="dashboard-card">
            <p className="dashboard-card-title">Name</p>
            <p className="dashboard-card-value">{selectedRepo?.fullName ?? "—"}</p>
          </div>
          <div className="dashboard-card">
            <p className="dashboard-card-title">Branch</p>
            <p className="dashboard-card-value">—</p>
          </div>
          <div className="dashboard-card">
            <p className="dashboard-card-title">Last Commit</p>
            <p className="dashboard-card-value">—</p>
          </div>
          <div className="dashboard-card">
            <p className="dashboard-card-title">Sync Status</p>
            <p className="dashboard-card-value">{syncing ? "Syncing…" : "Idle"}</p>
          </div>
        </div>
      </section>

      {/* KPI Cards */}
      <section className="dashboard-section">
        <p className="dashboard-section-title">KEY METRICS</p>
        <div className="dashboard-kpi">
          <div className="dashboard-card">
            <p className="dashboard-card-title">Activity Score</p>
            <p className="dashboard-card-value">
              {selectedScore ? selectedScore.activityScore.overallScore : "—"}
            </p>
          </div>
          <div className="dashboard-card">
            <p className="dashboard-card-title">Opened (14d)</p>
            <p className="dashboard-card-value">{openedLast14}</p>
          </div>
          <div className="dashboard-card">
            <p className="dashboard-card-title">Merged (14d)</p>
            <p className="dashboard-card-value">{mergedLast14}</p>
          </div>
          <div className="dashboard-card">
            <p className="dashboard-card-title">Contributors</p>
            <p className="dashboard-card-value">{contributors ?? "—"}</p>
          </div>
        </div>
      </section>

      {/* Repository Health */}
      <section className="dashboard-section dashboard-health">
        <p className="dashboard-section-title">REPOSITORY HEALTH</p>
        {selectedScore ? (
          <div className="dashboard-panel">
            <ScoreBar label="Review health" score={selectedScore.activityScore.breakdown.reviewHealth} compact />
            <ScoreBar label="Bus factor" score={selectedScore.activityScore.breakdown.busFactorScore} compact />
            <ScoreBar label="Staleness" score={selectedScore.activityScore.breakdown.staleness} compact />
            <ScoreBar label="Governance" score={selectedScore.activityScore.breakdown.governance} compact />
            <ScoreBar label="Sustainability" score={selectedScore.activityScore.breakdown.sustainability} compact />
          </div>
        ) : (
          <p className="dashboard-empty">—</p>
        )}

        {insights && (
          <div className="dashboard-panel" style={{ marginTop: 8 }}>
            <div className="dashboard-metric">
              <span>Approval ratio</span>
              <span>{Math.round(insights.reviewHealth.approvalRatio * 100)}%</span>
            </div>
            <div className="dashboard-metric">
              <span>Median time to first review</span>
              <span>
                {insights.reviewHealth.medianTimeToFirstReviewHours !== null
                  ? `${insights.reviewHealth.medianTimeToFirstReviewHours.toFixed(1)}h`
                  : "—"}
              </span>
            </div>
          </div>
        )}
      </section>

      {/* Trend — reuses TrendChart unchanged */}
      <section className="dashboard-section dashboard-chart">
        <p className="dashboard-section-title">TREND</p>
        <TrendChart trend={trend} />
      </section>

      {/* Activity Feed — reuses Timeline unchanged */}
      <section className="dashboard-section dashboard-feed">
        <p className="dashboard-section-title">ACTIVITY FEED</p>
        <Timeline events={flatEvents} />
        {flatEvents.length > 0 && (
          <p style={{ fontSize: 10, color: "var(--win-text-dim)", marginTop: 4 }}>
            Last updated {formatDateTime(new Date().toISOString())}
          </p>
        )}
      </section>

      {/* Recent Pull Requests */}
      <section className="dashboard-section">
        <p className="dashboard-section-title">RECENT PULL REQUESTS</p>
        {recentPullRequests.length > 0 ? (
          <div className="dashboard-table">
            {recentPullRequests.map(({ entry, latest }) => (
              <div className="dashboard-table-row" key={entry.pullRequestNumber}>
                <span className="dashboard-table-cell dashboard-table-cell-title">
                  #{entry.pullRequestNumber} {entry.pullRequestTitle}
                </span>
                <span className="dashboard-table-cell">{latest.actor}</span>
                <span className="dashboard-table-cell">{latest.type}</span>
                <span className="dashboard-table-cell">{formatRelativeTime(latest.at)}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="dashboard-empty">—</p>
        )}
      </section>

      {/* Repository Metrics */}
      <section className="dashboard-section">
        <p className="dashboard-section-title">REPOSITORY METRICS</p>
        {insights ? (
          <div className="dashboard-grid">
            <div className="dashboard-card">
              <p className="dashboard-card-title">Total reviewed</p>
              <p className="dashboard-card-value">{insights.reviewHealth.totalReviewed}</p>
            </div>
            <div className="dashboard-card">
              <p className="dashboard-card-title">Bus factor</p>
              <p className="dashboard-card-value">{insights.busFactor.busFactor}</p>
            </div>
            <div className="dashboard-card">
              <p className="dashboard-card-title">Stale items</p>
              <p className="dashboard-card-value">{insights.staleRadar.length}</p>
            </div>
            <div className="dashboard-card">
              <p className="dashboard-card-title">Reciprocity gaps</p>
              <p className="dashboard-card-value">{insights.reciprocityGap.length}</p>
            </div>
            <div className="dashboard-card">
              <p className="dashboard-card-title">Declining contributors</p>
              <p className="dashboard-card-value">
                {insights.commitDecay.filter((c) => c.trend === "decreasing").length}
              </p>
            </div>
            <div className="dashboard-card">
              <p className="dashboard-card-title">Stale issues</p>
              <p className="dashboard-card-value">{insights.issueGraveyard.length}</p>
            </div>
          </div>
        ) : (
          <p className="dashboard-empty">—</p>
        )}
      </section>

      {/* Insight Highlights — derived via the already-existing buildInsightFeed() */}
      {insightFeed.length > 0 && (
        <section className="dashboard-section">
          <p className="dashboard-section-title">INSIGHT HIGHLIGHTS</p>
          <div className="dashboard-panel">
            {insightFeed.map((item) => (
              <div key={item.id} className="dashboard-metric">
                <span>
                  <Badge tone={INSIGHT_SEVERITY_TONE[item.severity]}>{item.severity}</Badge> {item.title}
                </span>
                <span style={{ color: "var(--win-text-dim)", fontSize: 11 }}>{item.detail}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
