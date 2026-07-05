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
