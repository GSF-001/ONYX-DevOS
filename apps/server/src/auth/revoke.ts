// revoke.ts — revokes GitHub OAuth tokens/grants live via the GitHub Apps API.
//
// GitHub API reference:
//   DELETE /applications/{client_id}/token   — revoke a single token
//   DELETE /applications/{client_id}/grant   — revoke the whole app grant
// Both require HTTP Basic auth using the OAuth app's client_id/client_secret.
//
// Access tokens live on `users.accessToken` (one GitHub token per user account),
// not on a per-session `oauth_sessions` table — that table never existed.

import { eq } from "drizzle-orm";
import { db } from "../db/client.js";
import { sessions, users } from "../db/schema.js";
import { logger } from "../services/logger.js";

const GITHUB_API_BASE = "https://api.github.com";
const CLIENT_ID = process.env.GITHUB_CLIENT_ID ?? "";
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET ?? "";

if (!CLIENT_ID || !CLIENT_SECRET) {
  logger.error("revoke.ts: GITHUB_CLIENT_ID / GITHUB_CLIENT_SECRET not configured");
}

export class TokenRevocationError extends Error {
  constructor(
    message: string,
    public readonly status?: number
  ) {
    super(message);
    this.name = "TokenRevocationError";
  }
}

function basicAuthHeader(): string {
  return "Basic " + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");
}

export async function revokeAccessToken(accessToken: string): Promise<void> {
  const res = await fetch(`${GITHUB_API_BASE}/applications/${CLIENT_ID}/token`, {
    method: "DELETE",
    headers: {
      Authorization: basicAuthHeader(),
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    body: JSON.stringify({ access_token: accessToken }),
  });

  if (res.status === 204 || res.status === 404) {
    logger.info("revoke.revokeAccessToken: token revoked", { status: res.status });
    return;
  }

  const body = await res.text();
  logger.error("revoke.revokeAccessToken: GitHub rejected revocation", {
    status: res.status,
    body,
  });
  throw new TokenRevocationError(`GitHub token revocation failed with ${res.status}`, res.status);
}

export async function revokeGrant(accessToken: string): Promise<void> {
  const res = await fetch(`${GITHUB_API_BASE}/applications/${CLIENT_ID}/grant`, {
    method: "DELETE",
    headers: {
      Authorization: basicAuthHeader(),
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    body: JSON.stringify({ access_token: accessToken }),
  });

  if (res.status === 204 || res.status === 404) {
    logger.info("revoke.revokeGrant: grant revoked", { status: res.status });
    return;
  }

  const body = await res.text();
  logger.error("revoke.revokeGrant: GitHub rejected grant revocation", {
    status: res.status,
    body,
  });
  throw new TokenRevocationError(`GitHub grant revocation failed with ${res.status}`, res.status);
}

export async function revokeSession(sessionId: string): Promise<{ userId: number }> {
  const [session] = await db.select().from(sessions).where(eq(sessions.id, sessionId));

  if (!session) {
    throw new TokenRevocationError(`No session row found for id ${sessionId}`);
  }

  const [user] = await db.select().from(users).where(eq(users.id, session.userId));

  if (!user) {
    throw new TokenRevocationError(`No user row found for id ${session.userId}`);
  }

  await revokeAccessToken(user.accessToken);

  logger.info("revoke.revokeSession: GitHub token revoked for session", {
    sessionId,
    userId: user.id,
  });

  return { userId: user.id };
}

export async function revokeAllSessionsForUser(userId: number): Promise<{ sessionsRemoved: number }> {
  const [user] = await db.select().from(users).where(eq(users.id, userId));

  if (!user) {
    logger.info("revoke.revokeAllSessionsForUser: no user found", { userId });
    return { sessionsRemoved: 0 };
  }

  await revokeGrant(user.accessToken);

  const removed = await db.delete(sessions).where(eq(sessions.userId, userId)).returning();

  logger.info("revoke.revokeAllSessionsForUser: all sessions revoked and deleted", {
    userId,
    sessionsRemoved: removed.length,
  });

  return { sessionsRemoved: removed.length };
}
