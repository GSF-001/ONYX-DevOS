import type { WeekendHeatmapResult } from "../../shared/types";

export interface HeatmapViewState {
  data: WeekendHeatmapResult | null;
  loading: boolean;
  error: string | null;
}

export type { WeekendHeatmapResult };
