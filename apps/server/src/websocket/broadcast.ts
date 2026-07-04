import { roomRegistry } from "./rooms.js";
import { logger } from "../services/logger.js";

export interface BroadcastMessage {
  type: string;
  [key: string]: unknown;
}

const OPEN = 1;

export function broadcastToRoom(room: string, message: BroadcastMessage): void {
  const members = roomRegistry.membersOf(room);
  if (members.size === 0) return;

  const payload = JSON.stringify(message);

  for (const socket of members) {
    if (socket.readyState !== OPEN) continue;
    try {
      socket.send(payload);
    } catch (err) {
      logger.warn({ err, room }, "Failed to send websocket message to a client");
    }
  }
}
