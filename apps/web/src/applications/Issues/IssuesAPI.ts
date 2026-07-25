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

import { getRepositoryInsights } from "../../shared/api";

export const IssuesAPI = {
  /** No standalone /issues list endpoint exists — the issue-graveyard view
   * from Insights (old open issues) is the only issue-specific data the
   * backend currently exposes. */
  async getGraveyard(repositoryId: number) {
    const insights = await getRepositoryInsights(repositoryId);
    return insights.issueGraveyard;
  },
};
