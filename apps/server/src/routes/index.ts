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
import { dashboardRoutes } from "./dashboard.js";
import { repositoryRoutes } from "./repository.js";
import { pullRequestRoutes } from "./pullRequests.js";
import { reviewRoutes } from "./reviews.js";
import { insightsRoutes } from "./insights.js";
import { reportRoutes } from "./reports.js";
import { teamRoutes } from "./team.js";
import { activityRoutes } from "./activity.js";
import { settingsRoutes } from "./settings.js";
import { communityRoutes } from "./community.js";
import { groupsRoutes } from "./groups.js";
import { identityRoutes, registerIdentityStatsRoute } from "./identity.js";

export async function apiRoutes(app: FastifyInstance): Promise<void> {
  await app.register(dashboardRoutes);
  await app.register(repositoryRoutes);
  await app.register(pullRequestRoutes);
  await app.register(reviewRoutes);
  await app.register(insightsRoutes);
  await app.register(reportRoutes);
  await app.register(teamRoutes);
  await app.register(activityRoutes);
  await app.register(settingsRoutes);
  await app.register(communityRoutes);
  await app.register(groupsRoutes);
  await app.register(identityRoutes);
  await app.register(registerIdentityStatsRoute);
}
