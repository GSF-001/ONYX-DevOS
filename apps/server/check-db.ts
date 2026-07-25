/**
 * ONYX DevOS
 * Copyright (c) 2026 GSF-001
 * All rights reserved.
 */

import { db } from "./src/db/client.js";
import { repositories, pullRequests, reviews, webhookEvents } from "./src/db/schema.js";

const main = async () => {
  console.log("repositories:", await db.select().from(repositories));
  console.log("pull_requests:", await db.select().from(pullRequests));
  console.log("reviews:", await db.select().from(reviews));
  console.log("webhook_events:", await db.select().from(webhookEvents));

  process.exit(0);
};

main();
