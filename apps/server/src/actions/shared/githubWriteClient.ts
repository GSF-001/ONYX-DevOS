import { Octokit } from "@octokit/rest";

/**
 * GithubActorContext represents the already-authenticated caller.
 * This library does NOT perform its own authentication — the token
 * and user identity must be resolved upstream by the existing auth
 * module (session, GitHub App installation token, OAuth token, etc.)
 * and passed in by the route / workflow / automation layer that
 * calls into these actions.
 */
export interface GithubActorContext {
  /** A valid GitHub access token (user PAT, OAuth token, or App installation token) */
  githubToken: string;
  /** Internal user id used for audit logging and rate limiting */
  userId: string;
  /** GitHub login associated with the token, used for permission checks */
  githubLogin: string;
}

const clientCache = new Map<string, Octokit>();

/**
 * Creates (or reuses) an Octokit client for a given token.
 * Clients are cached per-token for the lifetime of the process to
 * avoid re-instantiating on every call within a request/workflow.
 */
export function createClient(token: string): Octokit {
  const cached = clientCache.get(token);
  if (cached) return cached;

  const client = new Octokit({
    auth: token,
    userAgent: "internal-github-write-actions/1.0.0",
  });

  clientCache.set(token, client);
  return client;
}

/**
 * Convenience helper: build a client directly from an actor context.
 */
export function clientFromActor(actor: GithubActorContext): Octokit {
  if (!actor?.githubToken) {
    throw new GithubClientError("Missing githubToken on actor context");
  }
  return createClient(actor.githubToken);
}

export class GithubClientError extends Error {
  constructor(message: string, public cause?: unknown) {
    super(message);
    this.name = "GithubClientError";
  }
}

/**
 * Wraps an Octokit call, normalizing errors into GithubClientError
 * so callers/actions have a consistent error shape to catch.
 */
export async function callGithub<T>(fn: () => Promise<T>, context: string): Promise<T> {
  try {
    return await fn();
  } catch (err: any) {
    const status = err?.status ?? "unknown";
    const message = err?.response?.data?.message ?? err?.message ?? "Unknown GitHub API error";
    throw new GithubClientError(`GitHub API call failed [${context}] (status ${status}): ${message}`, err);
  }
}
