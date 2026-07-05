import { getReviewerLoad, getRepositoryInsights, getTeam } from "../../shared/api";

/**
 * Honest limitation: there's no "get team by repository id" endpoint —
 * only GET /teams/:slug. This app assumes the same DEFAULT_TEAM_SLUG the
 * Dashboard app uses (see Dashboard/DashboardHooks.ts) until a team
 * picker exists.
 */
export const TeamAPI = {
  getTeam,
  getReviewerLoad,
  async getContributions(repositoryId: number) {
    const insights = await getRepositoryInsights(repositoryId);
    return insights.busFactor.contributions;
  },
};
