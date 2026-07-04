import type { FastifyInstance } from "fastify";
import { requireAuth } from "../auth/middleware.js";
import { getRepositoryById } from "../db/queries.js";
import { userHasTeamRole } from "../auth/permissions.js";
import { computeReviewTimeline } from "../scoring/reviewTimeline.js";
import { listPullRequestsForRepo } from "../db/queries.js";

export async function activityRoutes(app: FastifyInstance): Promise<void> {
  app.get<{ Params: { repositoryId: string } }>(
    "/repositories/:repositoryId/activity",
    { preHandler: requireAuth },
    async (request, reply) => {
      const repositoryId = Number(request.params.repositoryId);
      const repo = await getRepositoryById(repositoryId);
      if (!repo) {
        reply.code(404).send({ error: "Repository not found" });
        return;
      }
      if (repo.teamId) {
        const allowed = await userHasTeamRole(request.currentUser!.id, repo.teamId, "member");
        if (!allowed) {
          reply.code(403).send({ error: "Not a member of this team" });
          return;
        }
      }

      const recentPrs = await listPullRequestsForRepo(repositoryId, { limit: 15 });
      const timelines = await Promise.all(
        recentPrs.map(async (pr) => ({
          pullRequestNumber: pr.number,
          pullRequestTitle: pr.title,
          events: await computeReviewTimeline(pr.id),
        }))
      );

      reply.send(timelines);
    }
  );
}
