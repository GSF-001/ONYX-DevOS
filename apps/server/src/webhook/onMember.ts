import { db } from "../db/client";
import { logger } from "../services/logger";
import { broadcast } from "../websocket/broadcast";
import { createNotification } from "../services/notifications";

/**
 * onMember.ts
 * Handles GitHub's `member` webhook event (repository collaborator
 * added, removed, or permission changed).
 * Docs: https://docs.github.com/en/webhooks/webhook-events-and-payloads#member
 */

type MemberAction = "added" | "removed" | "edited";
type GithubPermission = "read" | "triage" | "write" | "maintain" | "admin";

interface GithubMember {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
}

interface GithubRepository {
  id: number;
  full_name: string;
  name: string;
}

interface MemberChanges {
  old_permission?: { to: GithubPermission };
  permission?: { from: GithubPermission };
}

export interface MemberWebhookPayload {
  action: MemberAction;
  member: GithubMember;
  changes?: MemberChanges;
  repository: GithubRepository;
  sender: { login: string; id: number };
}

export async function onMember(payload: MemberWebhookPayload): Promise<void> {
  const { action, member, changes, repository } = payload;

  logger.info("webhook.onMember: received", {
    action,
    repo: repository.full_name,
    member: member.login,
  });

  switch (action) {
    case "added": {
      await db.query(
        `insert into repository_collaborators (
           repository_id, github_user_id, login, avatar_url, permission, added_at, updated_at
         ) values ($1, $2, $3, $4, $5, now(), now())
         on conflict (repository_id, github_user_id) do update set
           permission = excluded.permission,
           updated_at = now()`,
        [repository.id, member.id, member.login, member.avatar_url, changes?.old_permission?.to ?? "read"],
      );

      await createNotification({
        type: "collaborator_added",
        repositoryId: repository.id,
        title: `${member.login} added to ${repository.full_name}`,
        body: `Permission: ${changes?.old_permission?.to ?? "read"}`,
        url: member.html_url,
      });
      break;
    }
    case "edited": {
      const newPermission = changes?.old_permission?.to;
      if (newPermission) {
        await db.query(
          `update repository_collaborators
           set permission = $1, updated_at = now()
           where repository_id = $2 and github_user_id = $3`,
          [newPermission, repository.id, member.id],
        );
      }
      break;
    }
    case "removed": {
      await db.query(
        `delete from repository_collaborators
         where repository_id = $1 and github_user_id = $2`,
        [repository.id, member.id],
      );

      await createNotification({
        type: "collaborator_removed",
        repositoryId: repository.id,
        title: `${member.login} removed from ${repository.full_name}`,
        body: null,
        url: repository.full_name ? `https://github.com/${repository.full_name}` : null,
      });
      break;
    }
  }

  broadcast(`repo:${repository.id}:team`, {
    event: "member.updated",
    action,
    member: { login: member.login, id: member.id, avatarUrl: member.avatar_url },
    permission: changes?.old_permission?.to ?? changes?.permission?.from ?? null,
    repository: { id: repository.id, fullName: repository.full_name },
  });

  logger.info("webhook.onMember: processed", { action, member: member.login });
}
