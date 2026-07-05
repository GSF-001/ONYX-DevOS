import type { ReportJobRecord } from "./ReportsTypes";

const STORAGE_KEY = "onyx.reportHistory";

/**
 * The server has no GET /reports (list) endpoint — export_jobs rows exist
 * in Postgres but aren't queryable by the client. This keeps a local
 * client-side history so the Reports window has *something* to show
 * across a session; it will not reflect reports generated from another
 * device or before this key existed.
 */
export function getReportHistory(): ReportJobRecord[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as ReportJobRecord[];
  } catch {
    return [];
  }
}

export function addReportToHistory(record: ReportJobRecord): void {
  const history = [record, ...getReportHistory()].slice(0, 30);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}
