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

export type ReportPeriod = "weekly" | "monthly" | "quarterly";
export type ReportFormat = "csv" | "json";

export interface ReportJobRecord {
  id: number;
  repositoryId: number;
  format: ReportFormat;
  period: ReportPeriod;
  filePath: string;
  createdAt: string;
}

export interface ReportsViewState {
  history: ReportJobRecord[];
  generating: boolean;
  error: string | null;
}
