/**
 * ONYX DevOS
 * Copyright (c) 2026 GSF-001
 * All rights reserved.
 */

import "dotenv/config";
import { db } from "../src/db/client.js";
import { teams, teamMembers, users } from "../src/db/schema.js";

async function main() {
  const allUsers = await db.select().from(users);
  if (allUsers.length === 0) {
    console.log("No users found. Log in via GitHub first.");
    process.exit(1);
  }
  const user = allUsers[0];

  const [team] = await db
    .insert(teams)
    .values({ name: "Demo Team", slug: "demo-team" })
    .returning();

  await db.insert(teamMembers).values({
    teamId: team.id,
    userId: user.id,
    role: "owner",
  });

  console.log("Team created:", team);
  console.log("Added user:", user.login, "as owner");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
