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
