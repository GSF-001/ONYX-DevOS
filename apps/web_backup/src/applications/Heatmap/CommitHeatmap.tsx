/**
 * ONYX DevOS
 * Copyright (c) 2026 GSF-001
 * All rights reserved.
 */

import { WeekendHeatmapWidget } from "../../shared/components";
import type { WeekendHeatmapResult } from "./HeatmapTypes";

/** The one heatmap with real backing data — commits table, day/hour grid. */
export function CommitHeatmap({ data }: { data: WeekendHeatmapResult }) {
  return <WeekendHeatmapWidget data={data} />;
}
