/**
 * ONYX DevOS
 * Copyright (c) 2026 GSF-001
 * All rights reserved.
 */

import { getReviewerLoad, getReciprocityGap } from "../../shared/api";

/**
 * Thin domain-specific wrapper over shared/api — matches the pattern used
 * by every other app's *API.ts (see Dashboard/DashboardAPI.ts).
 */
export const ReviewsAPI = {
  getReviewerLoad: (repositoryId: number) => getReviewerLoad(repositoryId),
  getReciprocityGap: (repositoryId: number) => getReciprocityGap(repositoryId),
};
