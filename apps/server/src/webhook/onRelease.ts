import { db } from "../db/client";
import { logger } from "../services/logger";
import { broadcast } from "../websocket/broadcast";
import { createNotification } from "../services/notifications";

/**
 * onRelease.ts
 * Handles GitHub's `release` webhook event.
 * Docs: https://docs.github.com/en/webhooks/webhook-events-and-payloads#release
 */

type ReleaseAction =
  | "published"
  | "unpublished"
  | "created"
  | "edited"
  | "deleted"
  | "prereleased"
  | "released";

interface GithubReleaseAsset {
  id: number;
  name: string;
  content_type: string;
  size: number;
  download_count: number;
  browser_download_url: string;
}

interface GithubRelease {
  id: number;
  tag_name: string;
  target_commitish: string;
  name: string | null;
  body: string | null;
  draft: boolean;
  prerelease: boolean;
  created_at: string;
  published_at: string | null;
  html_url: string;
  author: { login: string; id: number; avatar_url: string };
  assets: GithubReleaseAsset[];
}

interface GithubRepository {
  id: number;
  full_name: string;
  name: string;
  owner: { login: string };
}

export interface ReleaseWebhookPayload {
  action: ReleaseAction;
  release: GithubRelease;
  repository: GithubRepository;
  sender: { login: string; id: number };
}

export async function onRelease(payload: ReleaseWebhookPayload): Promise<void> {
  const { action, release, repository } = payload;

  logger.info("webhook.onRelease: received", {
    action,
    repo: repository.full_name,
    tag: release.tag_name,
  });

  switch (action) {
    case "created":
    case "edited":
    case "prereleased":
    case "published":
    case "released": {
      await db.query(
        `insert into releases (
           github_id, repository_id, tag_name, name, body, draft, prerelease,
           html_url, author_login, created_at, published_at, asset_count, updated_at
         ) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, now())
         on conflict (github_id) do update set
           tag_name = excluded.tag_name,
           name = excluded.name,
           body = excluded.body,
           draft = excluded.draft,
           prerelease = excluded.prerelease,
           html_url = excluded.html_url,
           published_at = excluded.published_at,
           asset_count = excluded.asset_count,
           updated_at = now()`,
        [
          release.id,
          repository.id,
          release.tag_name,
          release.name,
          release.body,
          release.draft,
          release.prerelease,
          release.html_url,
          release.author.login,
          release.created_at,
          release.published_at,
          release.assets.length,
        ],
      );
      break;
    }
    case "unpublished": {
      await db.query(
        `update releases set draft = true, published_at = null, updated_at = now()
         where github_id = $1`,
        [release.id],
      );
      break;
    }
    case "deleted": {
      await db.query(`delete from releases where github_id = $1`, [release.id]);
      break;
    }
  }

  if (action === "published" || action === "released") {
    await createNotification({
      type: "release_published",
      repositoryId: repository.id,
      title: `${release.tag_name} published in ${repository.full_name}`,
      body: release.name ?? release.tag_name,
      url: release.html_url,
    });
  }

  broadcast(`repo:${repository.id}:releases`, {
    event: "release.updated",
    action,
    release: {
      id: release.id,
      tagName: release.tag_name,
      name: release.name,
      draft: release.draft,
      prerelease: release.prerelease,
      publishedAt: release.published_at,
      htmlUrl: release.html_url,
    },
    repository: { id: repository.id, fullName: repository.full_name },
  });

  logger.info("webhook.onRelease: processed", { action, tag: release.tag_name });
}
