import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db, queryClient } from "./client.js";
import { logger } from "../services/logger.js";

export async function runMigrations(): Promise<void> {
  logger.info("Running database migrations...");
  await migrate(db, { migrationsFolder: new URL("../../drizzle", import.meta.url).pathname });
  logger.info("Database migrations complete.");
}

export async function closeDbConnection(): Promise<void> {
  await queryClient.end({ timeout: 5 });
}
