/**
 * ONYX DevOS
 * Copyright (c) 2026 GSF-001
 * All rights reserved.
 */

import type { RepositoryInsights } from "../../shared/api/endpoints";

export interface InsightsViewState {
  insights: RepositoryInsights | null;
  loading: boolean;
  error: string | null;
}

export type { RepositoryInsights };
