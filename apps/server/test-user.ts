/**
 * ONYX DevOS
 * Copyright (c) 2026 GSF-001
 * All rights reserved.
 */

import { createGitHubClient } from "./src/services/github.js";

async function main() {
  const client = createGitHubClient(process.argv[2]);
  console.log(await client.getAuthenticatedUser());
}

main().catch(console.error);
