import type { FastifyInstance } from "fastify";
import { randomBytes } from "node:crypto";
import { buildGithubAuthorizeUrl, completeGithubOAuth } from "./githubOAuth.js";
import { createSession, destroySession, getSession } from "./session.js";
import { signJwt, verifyJwt } from "./jwt.js";
import {
  clearSessionCookie,
  getSessionTokenFromRequest,
  setCsrfCookie,
  setSessionCookie,
} from "./cookies.js";
import { generateCsrfToken } from "./csrf.js";
import { getUserById } from "../db/queries.js";
import { requireAuth } from "./middleware.js";
import {
  ScopeValidationError,
  buildScopeUpgradeUrl,
  describeScope,
  fetchGrantedScopes,
  missingOptionalScopes,
  missingScopes,
  REQUIRED_SCOPES,
  OPTIONAL_SCOPES,
} from "./scopes.js";
import { ensureFreshAccessToken, TokenRefreshError } from "./refresh.js";
import { revokeAllSessionsForUser, revokeSession, TokenRevocationError } from "./revoke.js";

const oauthStateStore = new Map<string, number>();

function pruneExpiredStates() {
  const cutoff = Date.now() - 10 * 60 * 1000;
  for (const [state, createdAt] of oauthStateStore) {
    if (createdAt < cutoff) oauthStateStore.delete(state);
  }
}

export async function authPlugin(app: FastifyInstance): Promise<void> {
  app.get("/auth/github", async (_request, reply) => {
    pruneExpiredStates();
    const state = randomBytes(16).toString("hex");
    oauthStateStore.set(state, Date.now());
    reply.redirect(buildGithubAuthorizeUrl(state));
  });

  app.get<{ Querystring: { code?: string; state?: string } }>(
    "/auth/github/callback",
    async (request, reply) => {
      const { code, state } = request.query;

      if (!code || !state || !oauthStateStore.has(state)) {
        reply.code(400).send({ error: "Invalid OAuth state or missing code" });
        return;
      }
      oauthStateStore.delete(state);

      const user = await completeGithubOAuth(code);
      const { session, ttlSeconds } = await createSession({
        userId: user.id,
        userAgent: request.headers["user-agent"],
        ip: request.ip,
      });

      const token = signJwt({ userId: user.id, sessionId: session.id });
      setSessionCookie(reply, token, ttlSeconds);
      setCsrfCookie(reply, generateCsrfToken());

      const frontendUrl = process.env.CORS_ORIGIN ?? "/";
      reply.redirect(`${frontendUrl}/desktop`);
    }
  );

  // Best-effort GitHub-side token revocation on logout: local session is
  // always torn down regardless of whether the live revoke call succeeds,
  // so a GitHub outage never blocks a user from logging out.
  app.post("/auth/logout", { preHandler: requireAuth }, async (request, reply) => {
    const token = getSessionTokenFromRequest(request);
    if (token) {
      const payload = verifyJwt(token);
      if (payload) {
        try {
          await revokeSession(payload.sessionId);
        } catch (err) {
          if (err instanceof TokenRevocationError) {
            app.log.warn({ err, sessionId: payload.sessionId }, "GitHub token revocation failed during logout");
          } else {
            throw err;
          }
        }
        await destroySession(payload.sessionId);
      }
    }
    clearSessionCookie(reply);
    reply.send({ ok: true });
  });

  // Full account disconnect: revokes the entire GitHub OAuth grant (every
  // ONYX session for this user becomes invalid on GitHub's side too),
  // wipes all oauth_sessions rows, then ends the current cookie session.
  app.post("/auth/github/disconnect", { preHandler: requireAuth }, async (request, reply) => {
    const token = getSessionTokenFromRequest(request);
    const payload = token ? verifyJwt(token) : null;

    try {
      const { sessionsRemoved } = await revokeAllSessionsForUser(request.currentUser!.id);
      if (payload) await destroySession(payload.sessionId);
      clearSessionCookie(reply);
      reply.send({ ok: true, sessionsRemoved });
    } catch (err) {
      if (err instanceof TokenRevocationError) {
        reply.code(502).send({ error: "Failed to revoke GitHub grant", detail: err.message });
        return;
      }
      throw err;
    }
  });

  app.get("/auth/me", { preHandler: requireAuth }, async (request, reply) => {
    const user = await getUserById(request.currentUser!.id);
    if (!user) {
      reply.code(404).send({ error: "User not found" });
      return;
    }
    reply.send({
      id: user.id,
      login: user.login,
      name: user.name,
      avatarUrl: user.avatarUrl,
      email: user.email,
    });
  });

  // Live scope check: hits GitHub directly (not a cached/local value) so
  // a scope revoked on GitHub's side is caught immediately. Transparently
  // refreshes the access token first if it's near expiry.
  app.get("/auth/scopes", { preHandler: requireAuth }, async (request, reply) => {
    const token = getSessionTokenFromRequest(request);
    const payload = token ? verifyJwt(token) : null;
    if (!payload) {
      reply.code(401).send({ error: "Not authenticated" });
      return;
    }

    try {
      const accessToken = await ensureFreshAccessToken(payload.sessionId);
      const granted = await fetchGrantedScopes(accessToken);
      const missingRequired = missingScopes(granted);
      const missingOptional = missingOptionalScopes(granted);

      reply.send({
        granted: granted.map((scope) => ({ scope, description: describeScope(scope) })),
        missingRequired,
        missingOptional,
        satisfied: missingRequired.length === 0,
      });
    } catch (err) {
      if (err instanceof ScopeValidationError) {
        reply.code(403).send({ error: err.message, missing: err.missing });
        return;
      }
      if (err instanceof TokenRefreshError) {
        reply.code(401).send({ error: "Session expired, please sign in again", code: err.code });
        return;
      }
      throw err;
    }
  });

  // Returns a re-authorize URL requesting the union of currently granted
  // scopes plus whichever optional scopes the client asks to add — used
  // by Settings/Integrations.tsx when a user opts into e.g. Automation.
  app.get<{ Querystring: { scopes?: string } }>(
    "/auth/scopes/upgrade-url",
    { preHandler: requireAuth },
    async (request, reply) => {
      const token = getSessionTokenFromRequest(request);
      const payload = token ? verifyJwt(token) : null;
      if (!payload) {
        reply.code(401).send({ error: "Not authenticated" });
        return;
      }

      const requested = (request.query.scopes ?? "")
        .split(",")
        .map((s) => s.trim())
        .filter((s): s is string => OPTIONAL_SCOPES.includes(s));

      if (requested.length === 0) {
        reply.code(400).send({ error: "No valid optional scopes requested" });
        return;
      }

      const accessToken = await ensureFreshAccessToken(payload.sessionId);
      const granted = await fetchGrantedScopes(accessToken);

      pruneExpiredStates();
      const state = randomBytes(16).toString("hex");
      oauthStateStore.set(state, Date.now());

      const url = buildScopeUpgradeUrl({
        clientId: process.env.GITHUB_CLIENT_ID ?? "",
        redirectUri: `${process.env.API_ORIGIN ?? ""}/auth/github/callback`,
        state,
        currentlyGranted: granted,
        additionalScopes: requested,
      });

      reply.send({ url });
    }
  );
}

export { requireAuth, requireCsrf, requireTeamRole } from "./middleware.js";
export { userHasTeamRole, roleAtLeast, type Role } from "./permissions.js";
export { getSession } from "./session.js";
export {
  REQUIRED_SCOPES,
  OPTIONAL_SCOPES,
  hasRequiredScopes,
  missingScopes,
  missingOptionalScopes,
  fetchGrantedScopes,
  describeScope,
  ScopeValidationError,
} from "./scopes.js";
export { ensureFreshAccessToken, refreshExpiringSessions, TokenRefreshError } from "./refresh.js";
export { revokeSession, revokeAllSessionsForUser, TokenRevocationError } from "./revoke.js";
