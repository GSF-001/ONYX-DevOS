import { db } from "../db/client";
import { logger } from "../services/logger";

/**
 * revoke.ts
 * Revokes GitHub OAuth tokens/grants live via the GitHub Apps API and
 * cleans up the corresponding oauth_sessions row(s). Used on explicit
 * logout, "disconnect GitHub", and account-deletion flows.
 *
 * GitHub API reference:
 *   DELETE /applications/{client_id}/token   — revoke a single token
 *   DELETE /applications/{client_id}/grant   — revoke the whole app grant
 * Both require HTTP Basic auth using the OAuth app's client_id/client_secret.
 */

const GITHUB_API_BASE = "https://api.github.com";
const CLIENT_ID = process.env.GITHUB_CLIENT_ID ?? "";
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET ?? "";

if (!CLIENT_ID || !CLIENT_SECRET) {
  logger.error("revoke.ts: GITHUB_CLIENT_ID / GITHUB_CLIENT_SECRET not configured");
}

export class TokenRevocationError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = "TokenRevocationError";
  }
}

function basicAuthHeader(): string {
  return "Basic " + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");
}

/**
 * Revokes a single access token with GitHub. GitHub returns 204 on
 * success and 404 if the token was already invalid/revoked — both are
 * treated as success since the end state (token unusable) is the same.
 */
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

/**
 * Revokes the entire OAuth grant (all tokens issued to this user for the
 * app), which also removes ONYX from the user's "Authorized OAuth Apps"
 * list on GitHub. Used for full "disconnect account" flows.
 */
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

interface OAuthSessionRow {
  id: string;
  user_id: string;
  access_token: string;
}

/**
 * Full logout-and-disconnect flow for a single session: revokes the
 * token with GitHub live, then deletes the oauth_sessions row so no
 * stale credentials remain in the database.
 */
export async function revokeSession(sessionId: string): Promise<{ userId: string }> {
  const { rows } = await db.query<OAuthSessionRow>(
    `select id, user_id, access_token from oauth_sessions where id = $1 limit 1`,
    [sessionId],
  );
  const session = rows[0];

  if (!session) {
    throw new TokenRevocationError(`No oauth_sessions row found for id ${sessionId}`);
  }

  await revokeAccessToken(session.access_token);

  await db.query(`delete from oauth_sessions where id = $1`, [sessionId]);

  logger.info("revoke.revokeSession: session revoked and deleted", {
    sessionId,
    userId: session.user_id,
  });

  return { userId: session.user_id };
}

/**
 * Full account-disconnect flow: revokes the entire GitHub grant (all
 * ONYX sessions for that user become invalid on GitHub's side too),
 * then wipes every oauth_sessions row belonging to the user locally.
 */
export async function revokeAllSessionsForUser(userId: string): Promise<{ sessionsRemoved: number }> {
  const { rows } = await db.query<OAuthSessionRow>(
    `select id, user_id, access_token from oauth_sessions where user_id = $1`,
    [userId],
  );

  if (rows.length === 0) {
    logger.info("revoke.revokeAllSessionsForUser: no sessions found", { userId });
    return { sessionsRemoved: 0 };
  }

  // Revoking the grant on any one of the user's tokens invalidates the
  // whole grant on GitHub's side, so a single call suffices.
  await revokeGrant(rows[0].access_token);

  const { rowCount } = await db.query(`delete from oauth_sessions where user_id = $1`, [userId]);

  logger.info("revoke.revokeAllSessionsForUser: all sessions revoked and deleted", {
    userId,
    sessionsRemoved: rowCount,
  });

  return { sessionsRemoved: rowCount };
}
