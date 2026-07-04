import type { FastifyInstance } from "fastify";
import { and, eq } from "drizzle-orm";
import { requireAuth, requireCsrf } from "../auth/middleware.js";
import { db } from "../db/client.js";
import { teamMembers, teams } from "../db/schema.js";
import { getTeamBySlug, getUserByGithubId } from "../db/queries.js";
import { userHasTeamRole } from "../auth/permissions.js";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function teamRoutes(app: FastifyInstance): Promise<void> {
  app.post<{ Body: { name: string } }>(
    "/teams",
    { preHandler: [requireAuth, requireCsrf] },
    async (request, reply) => {
      const slug = slugify(request.body.name);

      const [team] = await db
        .insert(teams)
        .values({ name: request.body.name, slug })
        .returning();

      await db
        .insert(teamMembers)
        .values({ teamId: team.id, userId: request.currentUser!.id, role: "owner" });

      reply.code(201).send(team);
    }
  );

  app.get<{ Params: { slug: string } }>(
    "/teams/:slug",
    { preHandler: requireAuth },
    async (request, reply) => {
      const team = await getTeamBySlug(request.params.slug);
      if (!team) {
        reply.code(404).send({ error: "Team not found" });
        return;
      }

      const allowed = await userHasTeamRole(request.currentUser!.id, team.id, "member");
      if (!allowed) {
        reply.code(403).send({ error: "Not a member of this team" });
        return;
      }

      const members = await db
        .select()
        .from(teamMembers)
        .where(eq(teamMembers.teamId, team.id));

      reply.send({ team, members });
    }
  );

  app.post<{ Params: { teamId: string }; Body: { githubId: number; role?: "admin" | "member" } }>(
    "/teams/:teamId/members",
    { preHandler: [requireAuth, requireCsrf] },
    async (request, reply) => {
      const teamId = Number(request.params.teamId);

      const allowed = await userHasTeamRole(request.currentUser!.id, teamId, "admin");
      if (!allowed) {
        reply.code(403).send({ error: "Requires admin role" });
        return;
      }

      const targetUser = await getUserByGithubId(request.body.githubId);
      if (!targetUser) {
        reply.code(404).send({ error: "User has not signed in with GitHub yet" });
        return;
      }

      const [member] = await db
        .insert(teamMembers)
        .values({ teamId, userId: targetUser.id, role: request.body.role ?? "member" })
        .onConflictDoUpdate({
          target: [teamMembers.teamId, teamMembers.userId],
          set: { role: request.body.role ?? "member" },
        })
        .returning();

      reply.code(201).send(member);
    }
  );

  app.delete<{ Params: { teamId: string; userId: string } }>(
    "/teams/:teamId/members/:userId",
    { preHandler: [requireAuth, requireCsrf] },
    async (request, reply) => {
      const teamId = Number(request.params.teamId);

      const allowed = await userHasTeamRole(request.currentUser!.id, teamId, "admin");
      if (!allowed) {
        reply.code(403).send({ error: "Requires admin role" });
        return;
      }

      const targetUserId = Number(request.params.userId);

      await db
        .delete(teamMembers)
        .where(and(eq(teamMembers.teamId, teamId), eq(teamMembers.userId, targetUserId)));

      reply.code(204).send();
    }
  );
}
