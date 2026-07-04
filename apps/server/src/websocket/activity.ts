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
