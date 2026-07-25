/**
 * ONYX DevOS
 * Copyright (c) 2026 GSF-001
 * All rights reserved.
 */

import type { FastifyInstance } from "fastify";
import { eq } from "drizzle-orm";
import { requireAuth, requireCsrf } from "../auth/middleware.js";
import { db } from "../db/client.js";
import { identities } from "../db/schema.js";
import { getUserById } from "../db/queries.js";

const ADJECTIVES = ["SWIFT", "QUIET", "IRON", "AMBER", "COBALT", "SOLAR", "NEON", "GHOST"];
const NOUNS = ["PIXEL", "FALCON", "CIRCUIT", "ORBIT", "VECTOR", "ECHO", "GLYPH", "RONIN"];

function randomHandle(): string {
  const a = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const n = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  return `ONYX://${a}_${n}`;
}

function randomDeveloperId(): string {
  return `#${Math.random().toString(16).slice(2, 8).toUpperCase()}`;
}

const COOLDOWN_DAYS = 30;

export async function identityRoutes(app: FastifyInstance): Promise<void> {
  app.get("/identity/me", { preHandler: requireAuth }, async (request, reply) => {
    const [identity] = await db
      .select()
      .from(identities)
      .where(eq(identities.userId, request.currentUser!.id));

    if (!identity) {
      reply.code(404).send({ error: "No identity confirmed yet" });
      return;
    }

    reply.send({
      handle: identity.handle,
      developerId: identity.developerId,
      gender: identity.gender,
      createdAt: identity.createdAt,
      lastChangedAt: identity.lastChangedAt,
    });
  });

  app.get("/identity/candidates", { preHandler: requireAuth }, async (_request, reply) => {
    const candidates = Array.from({ length: 5 }, () => randomHandle());
    reply.send(candidates);
  });

  app.get("/identity/cooldown", { preHandler: requireAuth }, async (request, reply) => {
    const [identity] = await db
      .select()
      .from(identities)
      .where(eq(identities.userId, request.currentUser!.id));

    if (!identity) {
      reply.send({ canChange: true, nextChangeAt: null });
      return;
    }

    const nextChangeAt = new Date(identity.lastChangedAt);
    nextChangeAt.setDate(nextChangeAt.getDate() + COOLDOWN_DAYS);
    const canChange = Date.now() >= nextChangeAt.getTime();

    reply.send({ canChange, nextChangeAt: canChange ? null : nextChangeAt.toISOString() });
  });

  app.post<{ Body: { handle: string; gender: "male" | "female" } }>(
    "/identity/confirm",
    { preHandler: [requireAuth, requireCsrf] },
    async (request, reply) => {
      const { handle, gender } = request.body;
      if (!handle?.trim()) {
        reply.code(400).send({ error: "Handle is required" });
        return;
      }
      if (gender !== "male" && gender !== "female") {
        reply.code(400).send({ error: "Gender must be 'male' or 'female'" });
        return;
      }

      const user = await getUserById(request.currentUser!.id);
      const developerId = randomDeveloperId();

      const [identity] = await db
        .insert(identities)
        .values({ userId: user!.id, handle, developerId, gender })
        .onConflictDoUpdate({
          target: identities.userId,
          set: { handle, gender, lastChangedAt: new Date() },
        })
        .returning();

      reply.send({ handle: identity.handle, developerId: identity.developerId, gender: identity.gender });
    }
  );
}

/* Appended: real contribution stats for the Profile window, computed from
 * data already synced from GitHub — no separate bounty/plugin system exists,
 * so these numbers replace those placeholder concepts with real activity. */
import { count, eq as eqOp } from "drizzle-orm";
import { commits, reviews, teamMembers, repositories } from "../db/schema.js";

export async function registerIdentityStatsRoute(app: FastifyInstance): Promise<void> {
  app.get("/identity/stats", { preHandler: requireAuth }, async (request, reply) => {
    const user = await getUserById(request.currentUser!.id);
    if (!user) {
      reply.code(404).send({ error: "User not found" });
      return;
    }

    const [reviewsResult] = await db
      .select({ value: count() })
      .from(reviews)
      .where(eqOp(reviews.reviewerLogin, user.login));

    const [commitsResult] = await db
      .select({ value: count() })
      .from(commits)
      .where(eqOp(commits.authorLogin, user.login));

    const teamRows = await db
      .select({ teamId: teamMembers.teamId })
      .from(teamMembers)
      .where(eqOp(teamMembers.userId, user.id));

    let repositoriesConnected = 0;
    for (const row of teamRows) {
      const [repoCount] = await db
        .select({ value: count() })
        .from(repositories)
        .where(eqOp(repositories.teamId, row.teamId));
      repositoriesConnected += repoCount.value;
    }

    reply.send({
      reviewsGiven: reviewsResult.value,
      commitsPushed: commitsResult.value,
      repositoriesConnected,
    });
  });
}
