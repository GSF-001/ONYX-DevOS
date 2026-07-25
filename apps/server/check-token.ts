/**
 * ONYX DevOS
 * Copyright (c) 2026 GSF-001
 * All rights reserved.
 */

import { db } from "./src/db/client.js";
import { users } from "./src/db/schema.js";

async function main() {
  const rows = await db.select({
    login: users.login,
    accessToken: users.accessToken,
  }).from(users);

  console.log(rows);
}

main().catch(console.error);
