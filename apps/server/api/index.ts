import type { VercelRequest, VercelResponse } from "@vercel/node";
import Fastify from "fastify";
import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import { runMigrations } from "../src/db/migrations.js";
import { authPlugin } from "../src/auth/index.js";
import { identityRoutes } from "../src/routes/identity.js";
import { profileRoutes } from "../src/routes/profile.js";
import { webhookPlugin } from "../src/webhook/index.js";
import { apiRoutes } from "../src/routes/index.js";
import { logger } from "../src/services/logger.js";

const CORS_ORIGIN = process.env.CORS_ORIGIN ?? "http://localhost:5173";

let appPromise: ReturnType<typeof buildApp> | null = null;

async function buildApp() {
  const app = Fastify({ logger: false });

  await app.register(cors, { origin: CORS_ORIGIN, credentials: true });
  await app.register(cookie);
  await app.register(webhookPlugin);
  await app.register(authPlugin);
  await app.register(identityRoutes);
  await app.register(profileRoutes);
  await app.register(apiRoutes, { prefix: "/api" });

  app.get("/health", async () => ({ ok: true }));

  await app.ready();
  return app;
}

/**
 * Serverless entrypoint for Vercel. Migrations run once per cold start
 * (drizzle's migrate() is idempotent — safe to call repeatedly, it just
 * checks which migrations are already applied and skips them).
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!appPromise) {
    appPromise = (async () => {
      await runMigrations().catch((err) => logger.error({ err }, "Migration failed"));
      return buildApp();
    })();
  }

  const app = await appPromise;
  app.server.emit("request", req, res);
}
