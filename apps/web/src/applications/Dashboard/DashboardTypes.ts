import type { ActivityScoreResult, Repository } from "../../shared/types";
import type { ActivityFeedEntry, DashboardResponse } from "../../shared/api/endpoints";

export interface DashboardPrTrendPoint {
  date: string; // YYYY-MM-DD
  opened: number;
  merged: number;
}

export interface DashboardViewState {
  repositories: DashboardResponse["repositories"];
  scores: DashboardResponse["scores"];
  selectedRepositoryId: number | null;
  trend: DashboardPrTrendPoint[];
  activity: ActivityFeedEntry[];
  loading: boolean;
  error: string | null;
}

export type { Repository, ActivityScoreResult, DashboardResponse };

import type { RepositoryInsights } from "../../shared/api/endpoints";

export interface InsightFeedItem {
  id: string;
  severity: "high" | "medium" | "low";
  title: string;
  detail: string;
  at: string;
}

/** Derives the mockup's "Insight Feed" list from real insights data —
 * no separate feed endpoint exists, so this is computed client-side from
 * fields already returned by GET /repositories/:id/insights. */
export function buildInsightFeed(insights: RepositoryInsights): InsightFeedItem[] {
  const items: InsightFeedItem[] = [];

  if (insights.mergeWithoutReview.length > 0) {
    items.push({
      id: "merge-without-review",
      severity: "high",
      title: `${insights.mergeWithoutReview.length} PRs merged without review`,
      detail: insights.mergeWithoutReview.map((pr) => `#${pr.number}`).slice(0, 3).join(", "),
      at: insights.generatedAt,
    });
  }

  const overloaded = insights.reviewerLoad.filter((r) => r.overloaded);
  if (overloaded.length > 0) {
    items.push({
      id: "reviewer-bottleneck",
      severity: "medium",
      title: "Reviewer bottleneck",
      detail: `${overloaded.map((r) => r.reviewerLogin).join(", ")} carrying most of the load`,
      at: insights.generatedAt,
    });
  }

  const decaying = insights.commitDecay.filter((c) => c.trend === "decreasing");
  if (decaying.length > 0) {
    items.push({
      id: "commit-decay",
      severity: "low",
      title: "Commit activity slowing",
      detail: `${decaying.length} contributor(s) trending down`,
      at: insights.generatedAt,
    });
  }

  if (insights.busFactor.busFactor <= 1) {
    items.push({
      id: "bus-factor",
      severity: "high",
      title: "Bus factor is 1",
      detail: "A single contributor accounts for half of recent commits.",
      at: insights.generatedAt,
    });
  }

  return items;
}
