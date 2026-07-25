/**
 * ONYX DevOS
 * Copyright (c) 2026 GSF-001
 * All rights reserved.
 */

import { db } from "./src/db/client.js";
import { users } from "./src/db/schema.js";

const main = async () => {
  console.log(await db.select().from(users));
  process.exit(0);
};

main();
