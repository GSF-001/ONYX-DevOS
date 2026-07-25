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

export async function groupsRoutes(app: FastifyInstance): Promise<void> {
  // Stub: Groups module not yet implemented.
  // TODO: public/private/anonymous groups, membership, chat, files, activity.
  app.get("/groups", { preHandler: requireAuth }, async (_request, reply) => {
    reply.send({ groups: [] });
  });
} 
