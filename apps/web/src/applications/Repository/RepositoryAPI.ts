import { getRepository, getRepositoryInsights, updateRepositorySettings } from "../../shared/api";

export const RepositoryAPI = {
  getRepository,
  updateSettings: updateRepositorySettings,

  /** Contributors comes from the bus-factor breakdown already computed
   * server-side — there's no separate /contributors endpoint, and this
   * data is exactly the same thing (commit share per author). */
  async getContributors(repositoryId: number) {
    const insights = await getRepositoryInsights(repositoryId);
    return insights.busFactor.contributions;
  },
};
