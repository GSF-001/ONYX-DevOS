import { db } from "../db/client.js";
import { users } from "../db/schema.js";
import { getUserByGithubId } from "../db/queries.js";
import { eq } from "drizzle-orm";
import { createGitHubClient } from "../services/github.js";

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const GITHUB_OAUTH_CALLBACK_URL = process.env.GITHUB_OAUTH_CALLBACK_URL;

if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET || !GITHUB_OAUTH_CALLBACK_URL) {
  throw new Error("Missing GitHub OAuth environment variables");
}

export function buildGithubAuthorizeUrl(state: string): string {
  const url = new URL("https://github.com/login/oauth/authorize");
  url.searchParams.set("client_id", GITHUB_CLIENT_ID!);
  url.searchParams.set("redirect_uri", GITHUB_OAUTH_CALLBACK_URL!);
  url.searchParams.set("scope", "read:user user:email repo");
  url.searchParams.set("state", state);
  return url.toString();
}

interface GithubTokenResponse {
  access_token?: string;
  error?: string;
  error_description?: string;
}

async function exchangeCodeForToken(code: string): Promise<string> {
  const res = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      client_id: GITHUB_CLIENT_ID,
      client_secret: GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: GITHUB_OAUTH_CALLBACK_URL,
    }),
  });

  const data = (await res.json()) as GithubTokenResponse;

  if (!res.ok || !data.access_token) {
    throw new Error(data.error_description ?? "Failed to exchange GitHub OAuth code");
  }

  return data.access_token;
}

export async function completeGithubOAuth(code: string) {
  const accessToken = await exchangeCodeForToken(code);
  const client = createGitHubClient(accessToken);
  const profile = await client.getAuthenticatedUser();

  const existing = await getUserByGithubId(profile.id);

  if (existing) {
    const [updated] = await db
      .update(users)
      .set({
        login: profile.login,
        name: profile.name,
        avatarUrl: profile.avatar_url,
        email: profile.email,
        accessToken,
        updatedAt: new Date(),
      })
      .where(eq(users.id, existing.id))
      .returning();
    return updated;
  }

  const [created] = await db
    .insert(users)
    .values({
      githubId: profile.id,
      login: profile.login,
      name: profile.name,
      avatarUrl: profile.avatar_url,
      email: profile.email,
      accessToken,
    })
    .returning();

  return created;
}
