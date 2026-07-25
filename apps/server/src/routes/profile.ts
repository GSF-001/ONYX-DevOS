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
import { requireAuth } from "../auth/index.js";
import { getUserById } from "../db/queries.js";

export async function profileRoutes(app: FastifyInstance): Promise<void> {
  // Stub: returns current user's profile info.
  // TODO: replace with full profile system (reputation, badges, activity).
  app.get("/profile/me", { preHandler: requireAuth }, async (request, reply) => {
    const user = await getUserById(request.currentUser!.id);
    if (!user) {
      reply.code(404).send({ error: "User not found" });
      return;
    }
    reply.send({
      id: user.id,
      login: user.login,
      name: user.name,
      avatarUrl: user.avatarUrl,
      email: user.email,
    });
  });
} 
