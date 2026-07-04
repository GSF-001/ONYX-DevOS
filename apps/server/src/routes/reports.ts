import type { FastifyInstance } from "fastify";
import path from "node:path";
import { requireAuth, requireCsrf } from "../auth/middleware.js";
import { getRepositoryById } from "../db/queries.js";
import { userHasTeamRole } from "../auth/permissions.js";
import { createExportJob } from "../services/exports.js";
import { readExportFile } from "../services/storage.js";

const EXPORTS_DIR = path.resolve(process.env.EXPORTS_DIR ?? "./data/exports");

export async function reportRoutes(app: FastifyInstance): Promise<void> {
  app.post<{
    Params: { repositoryId: string };
    Body: { format: "csv" | "json" };
  }>(
    "/repositories/:repositoryId/reports",
    { preHandler: [requireAuth, requireCsrf] },
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

      const job = await createExportJob(
        request.currentUser!.id,
        repositoryId,
        request.body.format ?? "json"
      );

      reply.code(201).send(job);
    }
  );

  app.get<{ Querystring: { filePath: string } }>(
    "/reports/download",
    { preHandler: requireAuth },
    async (request, reply) => {
      const resolved = path.resolve(request.query.filePath);
      if (!resolved.startsWith(EXPORTS_DIR)) {
        reply.code(400).send({ error: "Invalid file path" });
        return;
      }

      const content = await readExportFile(resolved);
      reply.type(request.query.filePath.endsWith(".csv") ? "text/csv" : "application/json");
      reply.send(content);
    }
  );
}
