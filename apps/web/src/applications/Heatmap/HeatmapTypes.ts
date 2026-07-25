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

import type { WeekendHeatmapResult } from "../../shared/types";

export interface HeatmapViewState {
  data: WeekendHeatmapResult | null;
  loading: boolean;
  error: string | null;
}

export type { WeekendHeatmapResult };
