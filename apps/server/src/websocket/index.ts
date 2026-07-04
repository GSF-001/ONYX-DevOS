import type { FastifyInstance } from "fastify";
import websocketPlugin from "@fastify/websocket";
import type { WebSocket } from "ws";
import { verifyJwt } from "../auth/jwt.js";
import { getSession } from "../auth/session.js";
import { SESSION_COOKIE_NAME } from "../auth/cookies.js";
import { roomRegistry } from "./rooms.js";
import { attachHeartbeat, startHeartbeatSweep } from "./heartbeat.js";
import { logger } from "../services/logger.js";

const allSockets = new Set<WebSocket>();

function parseCookies(header: string | undefined): Record<string, string> {
  if (!header) return {};
  return Object.fromEntries(
    header.split(";").map((pair) => {
      const [key, ...rest] = pair.trim().split("=");
      return [key, decodeURIComponent(rest.join("="))];
    })
  );
}

export async function websocketRoutePlugin(app: FastifyInstance): Promise<void> {
  await app.register(websocketPlugin);

  startHeartbeatSweep(() => allSockets);

  app.get("/ws", { websocket: true }, async (connection, request) => {
    const socket = connection as unknown as WebSocket;

    const cookies = parseCookies(request.headers.cookie);
    const token = cookies[SESSION_COOKIE_NAME];
    const payload = token ? verifyJwt(token) : null;

    if (!payload) {
      socket.close(4001, "Unauthorized");
      return;
    }

    const session = await getSession(payload.sessionId);
    if (!session) {
      socket.close(4001, "Session expired");
      return;
    }

    allSockets.add(socket);
    attachHeartbeat(socket);

    socket.on("message", (raw: Buffer) => {
      try {
        const msg = JSON.parse(raw.toString("utf-8")) as {
          action: "subscribe" | "unsubscribe";
          room: string;
        };

        if (msg.action === "subscribe") {
          roomRegistry.join(msg.room, socket);
        } else if (msg.action === "unsubscribe") {
          roomRegistry.leave(msg.room, socket);
        }
      } catch (err) {
        logger.warn({ err }, "Received malformed websocket message");
      }
    });

    socket.on("close", () => {
      roomRegistry.leaveAll(socket);
      allSockets.delete(socket);
    });
  });
}

export { broadcastToRoom } from "./broadcast.js";
export { emitActivityEvent } from "./activity.js";
export { emitDashboardScoreUpdate } from "./dashboard.js";
export { sendNotification } from "./notifications.js";
export { emitRepositoryUpdate } from "./repository.js";
export { roomRegistry } from "./rooms.js";
