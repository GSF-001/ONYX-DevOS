import type { FastifyInstance } from "fastify";
import { eq } from "drizzle-orm";
import { requireAuth, requireCsrf } from "../auth/middleware.js";
import { db } from "../db/client.js";
import { repositories, teams } from "../db/schema.js";
import { userHasTeamRole } from "../auth/permissions.js";

export async function settingsRoutes(app: FastifyInstance): Promise<void> {
  app.patch<{ Params: { teamId: string }; Body: { name?: string } }>(
    "/teams/:teamId/settings",
    { preHandler: [requireAuth, requireCsrf] },
    async (request, reply) => {
      const teamId = Number(request.params.teamId);

      const allowed = await userHasTeamRole(request.currentUser!.id, teamId, "admin");
      if (!allowed) {
        reply.code(403).send({ error: "Requires admin role" });
        return;
      }

      const [updated] = await db
        .update(teams)
        .set({ ...(request.body.name ? { name: request.body.name } : {}) })
        .where(eq(teams.id, teamId))
        .returning();

      reply.send(updated);
    }
  );

  app.patch<{
    Params: { repositoryId: string };
    Body: { defaultBranch?: string };
  }>(
    "/repositories/:repositoryId/settings",
    { preHandler: [requireAuth, requireCsrf] },
    async (request, reply) => {
      const repositoryId = Number(request.params.repositoryId);
      const [repo] = await db
        .select()
        .from(repositories)
        .where(eq(repositories.id, repositoryId));

      if (!repo) {
        reply.code(404).send({ error: "Repository not found" });
        return;
      }
      if (repo.teamId) {
        const allowed = await userHasTeamRole(request.currentUser!.id, repo.teamId, "admin");
        if (!allowed) {
          reply.code(403).send({ error: "Requires admin role" });
          return;
        }
      }

      const [updated] = await db
        .update(repositories)
        .set({
          ...(request.body.defaultBranch ? { defaultBranch: request.body.defaultBranch } : {}),
        })
        .where(eq(repositories.id, repositoryId))
        .returning();

      reply.send(updated);
    }
  );
}
