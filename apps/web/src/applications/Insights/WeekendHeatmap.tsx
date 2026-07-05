import { WeekendHeatmapWidget } from "../../shared/components";
import type { RepositoryInsights } from "./InsightsTypes";

/** Thin wrapper, same pattern as Reviews/ReviewerLoad.tsx — actual
 * rendering is the shared widget, reused identically on the standalone
 * Heatmap app. */
export function WeekendHeatmap({ data }: { data: RepositoryInsights["weekendHeatmap"] }) {
  return <WeekendHeatmapWidget data={data} />;
}
