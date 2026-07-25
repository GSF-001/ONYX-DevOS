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

import { broadcastToRoom } from "./broadcast.js";

export interface ActivityEvent {
  repositoryId: number;
  kind: "commit" | "pull_request" | "review" | "issue" | "check_run";
  summary: string;
  actor: string;
  at: string;
}

export function emitActivityEvent(event: ActivityEvent): void {
  broadcastToRoom(`activity:${event.repositoryId}`, {
    type: "activity.new",
    ...event,
  });
}
