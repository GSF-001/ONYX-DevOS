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

import type { FastifyInstance } from "fastify";
import { eq } from "drizzle-orm";
import { requireAuth, requireCsrf } from "../auth/middleware.js";
import { db } from "../db/client.js";
import { repositories } from "../db/schema.js";
import { getRepositoryById, getUserById } from "../db/queries.js";
import { userHasTeamRole } from "../auth/permissions.js";
import { syncRepository } from "../services/repository.js";
import { createGitHubClient } from "../services/github.js";

export async function repositoryRoutes(app: FastifyInstance): Promise<void> {
  app.get(
    "/repositories/available",
    { preHandler: requireAuth },
    async (request, reply) => {
      const user = await getUserById(request.currentUser!.id);
      const client = createGitHubClient(user!.accessToken);
      const ghRepos = await client.listRepos();

      const connected = await db.select({ githubRepoId: repositories.githubRepoId }).from(repositories);
      const connectedIds = new Set(connected.map((r) => r.githubRepoId));

      const available = ghRepos
        .filter((r) => !connectedIds.has(r.id))
        .map((r) => ({
          githubRepoId: r.id,
          owner: r.owner.login,
          name: r.name,
          fullName: r.full_name,
          private: r.private,
        }));

      reply.send(available);
    }
  );

  app.get<{ Params: { id: string } }>(
    "/repositories/:id",
    { preHandler: requireAuth },
    async (request, reply) => {
      const repo = await getRepositoryById(Number(request.params.id));
      if (!repo) {
        reply.code(404).send({ error: "Repository not found" });
        return;
      }
      reply.send(repo);
    }
  );

  /**
   * Real commit graph for a connected repository. Fetches branch list,
   * then walks commit history from each branch head (capped per branch to
   * keep this bounded), merges by sha to dedupe shared history, and
   * returns a flat commit list + branch list the frontend's existing
   * layout algorithm (computeLayout in GitGraphAPI.ts) can render as-is.
   *
   * Caveat: GitHub's commits endpoint doesn't tag which branch a commit
   * was "authored on" once history is shared/merged — we label each
   * commit with the first branch (by branch list order) whose history
   * includes it, which is a reasonable heuristic, not exact git metadata.
   */
  app.get<{ Params: { id: string } }>(
    "/repositories/:id/git-graph",
    { preHandler: requireAuth },
    async (request, reply) => {
      const repo = await getRepositoryById(Number(request.params.id));
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

      const user = await getUserById(request.currentUser!.id);
      const client = createGitHubClient(user!.accessToken);

      const ghBranches = await client.listBranches(repo.owner, repo.name);
      const maxBranches = 5;
      const maxCommitsPerBranch = 60;
      const branchesToWalk = ghBranches.slice(0, maxBranches);

      const commitMap = new Map<
        string,
        {
          hash: string;
          parents: string[];
          author: string;
          authorEmail: string;
          message: string;
          timestamp: number;
          branch: string;
          changedFiles: [];
        }
      >();

      for (const branch of branchesToWalk) {
        const ghCommits = await client
          .listCommitsForRef(repo.owner, repo.name, branch.name, maxCommitsPerBranch)
          .catch(() => []);
        console.log("BRANCH:", branch.name, "COMMITS:", ghCommits.length);

        for (const c of ghCommits) {
          if (commitMap.has(c.sha)) continue;
          commitMap.set(c.sha, {
            hash: c.sha,
            parents: c.parents.map((p) => p.sha),
            author: c.commit.author?.name ?? c.author?.login ?? "Unknown",
            authorEmail: c.commit.author?.email ?? "",
            message: c.commit.message.split("\n")[0],
            timestamp: Math.floor(new Date(c.commit.author.date).getTime() / 1000),
            branch: branch.name,
            changedFiles: [],
          });
        }
      }

      const commits = Array.from(commitMap.values()).sort((a, b) => b.timestamp - a.timestamp);

      const palette = ["#e0a458", "#4fb0a5", "#9a7bd1", "#d97a86", "#8fae6b", "#6fa8d1"];
      const branches = ghBranches.map((b, i) => ({
        name: b.name,
        head: b.commit.sha,
        color: palette[i % palette.length],
        isRemote: false,
        isCurrent: b.name === repo.defaultBranch,
      }));

      console.log("TOTAL COMMITS:", commits.length);
      reply.send({ commits, branches });
    }
  );

  app.post<{ Body: { teamId: number; owner: string; name: string } }>(
    "/repositories",
    { preHandler: [requireAuth, requireCsrf] },
    async (request, reply) => {
      const { teamId, owner, name } = request.body;

      const allowed = await userHasTeamRole(request.currentUser!.id, teamId, "admin");
      if (!allowed) {
        reply.code(403).send({ error: "Requires admin role on the team" });
        return;
      }

      const user = await getUserById(request.currentUser!.id);
      const client = createGitHubClient(user!.accessToken);
      const ghRepo = await client.getRepo(owner, name);

      const [repo] = await db
        .insert(repositories)
        .values({
          teamId,
          githubRepoId: ghRepo.id,
          owner,
          name,
          fullName: ghRepo.full_name,
          defaultBranch: ghRepo.default_branch,
          private: ghRepo.private,
        })
        .onConflictDoUpdate({
          target: repositories.githubRepoId,
          set: { teamId, defaultBranch: ghRepo.default_branch },
        })
        .returning();

      reply.code(201).send(repo);
    }
  );

  app.post<{ Params: { id: string } }>(
    "/repositories/:id/sync",
    { preHandler: [requireAuth, requireCsrf] },
    async (request, reply) => {
      const repo = await getRepositoryById(Number(request.params.id));
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

      const user = await getUserById(request.currentUser!.id);
      await syncRepository(repo.id, user!.accessToken);

      reply.send({ ok: true });
    }
  );

  app.delete<{ Params: { id: string } }>(
    "/repositories/:id",
    { preHandler: [requireAuth, requireCsrf] },
    async (request, reply) => {
      const repo = await getRepositoryById(Number(request.params.id));
      if (!repo) {
        reply.code(404).send({ error: "Repository not found" });
        return;
      }

      if (repo.teamId) {
        const allowed = await userHasTeamRole(request.currentUser!.id, repo.teamId, "admin");
        if (!allowed) {
          reply.code(403).send({ error: "Requires admin role on the team" });
          return;
        }
      }

      await db.delete(repositories).where(eq(repositories.id, repo.id));
      reply.code(204).send();
    }
  );
}
