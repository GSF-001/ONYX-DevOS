import { logger } from "../services/logger";

/**
 * scopes.ts
 * Manages GitHub OAuth scope requirements, validation, and live scope
 * verification against the GitHub API (x-oauth-scopes response header).
 */

const GITHUB_API_BASE = "https://api.github.com";
const GITHUB_AUTHORIZE_URL = "https://github.com/login/oauth/authorize";

/** Scopes ONYX requires for core functionality (webhooks, PR/issue actions, repo reads). */
export const REQUIRED_SCOPES: readonly string[] = [
  "repo",
  "read:org",
  "read:user",
  "user:email",
  "notifications",
];

/** Scopes that unlock optional ONYX features (Automation, Release Center, admin actions). */
export const OPTIONAL_SCOPES: readonly string[] = [
  "workflow",
  "admin:repo_hook",
  "delete_repo",
];

export const ALL_KNOWN_SCOPES: readonly string[] = [
  ...REQUIRED_SCOPES,
  ...OPTIONAL_SCOPES,
];

export class ScopeValidationError extends Error {
  constructor(
    message: string,
    public readonly missing: string[],
  ) {
    super(message);
    this.name = "ScopeValidationError";
  }
}

/**
 * Parses the `x-oauth-scopes` header GitHub returns on any authenticated
 * API response into a normalized, deduplicated scope array.
 */
export function parseScopeHeader(headerValue: string | null | undefined): string[] {
  if (!headerValue) return [];
  return Array.from(
    new Set(
      headerValue
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    ),
  );
}

/**
 * A scope is satisfied either by an exact match or by a broader parent
 * scope already covering it (GitHub scope hierarchy, e.g. `repo` covers
 * `repo:status`, `repo_deployment`, `public_repo`, etc.).
 */
const SCOPE_HIERARCHY: Record<string, string[]> = {
  repo: ["repo:status", "repo_deployment", "public_repo", "repo:invite", "security_events"],
  "admin:org": ["write:org", "read:org"],
  "write:org": ["read:org"],
  "admin:public_key": ["write:public_key", "read:public_key"],
  "write:public_key": ["read:public_key"],
  "admin:repo_hook": ["write:repo_hook", "read:repo_hook"],
  "write:repo_hook": ["read:repo_hook"],
  "admin:org_hook": [],
  "admin:gpg_key": ["write:gpg_key", "read:gpg_key"],
  "write:gpg_key": ["read:gpg_key"],
};

function expandGrantedScopes(granted: string[]): Set<string> {
  const expanded = new Set(granted);
  for (const scope of granted) {
    const implied = SCOPE_HIERARCHY[scope];
    if (implied) {
      for (const s of implied) expanded.add(s);
    }
  }
  return expanded;
}

/** Returns true if every required scope is present (directly or via hierarchy). */
export function hasRequiredScopes(granted: string[]): boolean {
  return missingScopes(granted).length === 0;
}

/** Returns the subset of REQUIRED_SCOPES not present in the granted list. */
export function missingScopes(granted: string[]): string[] {
  const expanded = expandGrantedScopes(granted);
  return REQUIRED_SCOPES.filter((scope) => !expanded.has(scope));
}

/** Returns which OPTIONAL_SCOPES are missing, so the UI can prompt for upgrades. */
export function missingOptionalScopes(granted: string[]): string[] {
  const expanded = expandGrantedScopes(granted);
  return OPTIONAL_SCOPES.filter((scope) => !expanded.has(scope));
}

/**
 * Hits GitHub's API live with the given access token and reads the
 * `x-oauth-scopes` header to get the actual, currently-granted scopes —
 * this is the source of truth, since scopes can be revoked/changed
 * server-side on GitHub without ONYX being notified.
 */
export async function fetchGrantedScopes(accessToken: string): Promise<string[]> {
  const res = await fetch(`${GITHUB_API_BASE}/user`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  if (res.status === 401) {
    throw new ScopeValidationError("Access token is invalid or expired", [...REQUIRED_SCOPES]);
  }
  if (!res.ok) {
    logger.error("scopes.fetchGrantedScopes: GitHub API error", {
      status: res.status,
      statusText: res.statusText,
    });
    throw new Error(`GitHub API responded with ${res.status}`);
  }

  const scopes = parseScopeHeader(res.headers.get("x-oauth-scopes"));
  logger.info("scopes.fetchGrantedScopes: resolved live scopes", { scopes });
  return scopes;
}

/**
 * Fetches live scopes and throws ScopeValidationError if any required
 * scope is missing. Call this before allowing access to gated routes.
 */
export async function assertRequiredScopes(accessToken: string): Promise<string[]> {
  const granted = await fetchGrantedScopes(accessToken);
  const missing = missingScopes(granted);
  if (missing.length > 0) {
    throw new ScopeValidationError(
      `Missing required GitHub scopes: ${missing.join(", ")}`,
      missing,
    );
  }
  return granted;
}

/**
 * Builds a re-authorization URL to GitHub's OAuth authorize endpoint that
 * requests the union of currently-granted scopes plus the missing ones —
 * so re-authorizing never silently drops a scope the user already has.
 */
export function buildScopeUpgradeUrl(params: {
  clientId: string;
  redirectUri: string;
  state: string;
  currentlyGranted: string[];
  additionalScopes: string[];
}): string {
  const { clientId, redirectUri, state, currentlyGranted, additionalScopes } = params;
  const scopeSet = new Set([...currentlyGranted, ...additionalScopes]);
  const url = new URL(GITHUB_AUTHORIZE_URL);
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("scope", Array.from(scopeSet).join(" "));
  url.searchParams.set("state", state);
  return url.toString();
}

/** Human-readable label for a scope, used in the Permissions.tsx UI. */
export function describeScope(scope: string): string {
  const descriptions: Record<string, string> = {
    repo: "Full access to repositories (code, PRs, issues, releases)",
    "read:org": "Read org membership and team structure",
    "read:user": "Read profile information",
    "user:email": "Read email addresses",
    notifications: "Read and manage notifications",
    workflow: "Manage GitHub Actions workflow files",
    "admin:repo_hook": "Manage repository webhooks",
    delete_repo: "Delete repositories",
  };
  return descriptions[scope] ?? scope;
}
