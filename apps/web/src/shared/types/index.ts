/**
 * ONYX DevOS — Developer Operating System
 * © 2026 GSF-001
 *
 * Proprietary Software.
 * Unauthorized use is strictly prohibited.
 */

/**
 * ONYX DevOS
 * Copyright (c) 2026 GSF-001
 * All rights reserved.
 */

export * from "./User";
export * from "./Repository";
export * from "./PullRequest";
export * from "./Review";
export * from "./Issue";
export * from "./TeamMember";

export interface WeekendHeatmapCell {
  dayOfWeek: number;
  hour: number;
  count: number;
}

export interface WeekendHeatmapResult {
  cells: WeekendHeatmapCell[];
  weekendCommitRatio: number;
}

export interface ActivityScoreResult {
  repositoryId: number;
  overallScore: number;
  breakdown: {
    reviewHealth: number;
    busFactorScore: number;
    staleness: number;
    governance: number;
    sustainability: number;
  };
}
