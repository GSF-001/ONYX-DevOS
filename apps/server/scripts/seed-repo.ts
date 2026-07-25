/**
 * ONYX DevOS
 * Copyright (c) 2026 GSF-001
 * All rights reserved.
 */

import "dotenv/config";
import { db } from "../src/db/client.js";
import { repositories, teams } from "../src/db/schema.js";
import { eq } from "drizzle-orm";

async function main() {
  const [team] = await db.select().from(teams).where(eq(teams.slug, "demo-team"));
  if (!team) {
    console.log("Team 'demo-team' not found. Run seed-team.ts first.");
    process.exit(1);
  }

  const [repo] = await db
    .insert(repositories)
    .values({
      teamId: team.id,
      githubRepoId: 0, // placeholder, will fix after real sync
      owner: "GSF-001",
      name: "ONYX-DevOS",
      fullName: "GSF-001/ONYX-DevOS",
      defaultBranch: "main",
      private: false,
    })
    .returning();

  console.log("Repository created:", repo);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
}); 
