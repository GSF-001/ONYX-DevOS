import { getRepositoryInsights } from "../../shared/api";

export const HeatmapAPI = {
  /** The only heatmap the backend actually computes is commit-based
   * (scoring/weekendHeatmap.ts reads the commits table only). */
  async getCommitHeatmap(repositoryId: number) {
    const insights = await getRepositoryInsights(repositoryId);
    return insights.weekendHeatmap;
  },
};
