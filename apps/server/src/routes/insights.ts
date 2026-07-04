import type { FastifyInstance } from "fastify";
import { requireAuth } from "../auth/middleware.js";
import { getRepositoryById } from "../db/queries.js";
import { userHasTeamRole } from "../auth/permissions.js";
import { getRepositoryInsights } from "../services/analytics.js";

export async function insightsRoutes(app: FastifyInstance): Promise<void> {
  app.get<{ Params: { repositoryId: string } }>(
    "/repositories/:repositoryId/insights",
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

      const insights = await getRepositoryInsights(repositoryId);
      reply.send(insights);
    }
  );
}
