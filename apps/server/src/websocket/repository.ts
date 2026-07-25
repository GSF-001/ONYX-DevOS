/**
 * ONYX DevOS
 * Copyright (c) 2026 GSF-001
 * All rights reserved.
 */

import { broadcastToRoom } from "./broadcast.js";

export function emitRepositoryUpdate(
  repositoryId: number,
  message: Record<string, unknown>
): void {
  broadcastToRoom(`repository:${repositoryId}`, {
    type: "repository.updated",
    repositoryId,
    ...message,
  });
}
