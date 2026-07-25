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

import { WeekendHeatmapWidget } from "../../shared/components";
import type { RepositoryInsights } from "./InsightsTypes";

/** Thin wrapper, same pattern as Reviews/ReviewerLoad.tsx — actual
 * rendering is the shared widget, reused identically on the standalone
 * Heatmap app. */
export function WeekendHeatmap({ data }: { data: RepositoryInsights["weekendHeatmap"] }) {
  return <WeekendHeatmapWidget data={data} />;
}
