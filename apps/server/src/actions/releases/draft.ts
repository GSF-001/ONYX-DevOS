import { GithubActorContext, clientFromActor, callGithub } from "../shared/githubWriteClient";
import { assertRepoPermission } from "../shared/permissionCheck";
import { checkRateLimit } from "../shared/rateLimit";
import { recordActionResult } from "../shared/auditLog";

export interface DraftReleaseInput {
  owner: string;
  repo: string;
  tagName: string;
  targetCommitish?: string;
  name?: string;
  body?: string;
  prerelease?: boolean;
}

const ACTION = "releases.draft";

/** Creates an unpublished (draft) release, to be published later via releases/publish.ts. */
export async function draftRelease(actor: GithubActorContext, input: DraftReleaseInput) {
  const target = `${input.owner}/${input.repo}@${input.tagName}`;
  try {
    await assertRepoPermission(actor, input.owner, input.repo, "write");
    checkRateLimit(actor.userId, ACTION);

    const client = clientFromActor(actor);
    const { data } = await callGithub(
      () =>
        client.repos.createRelease({
          owner: input.owner,
          repo: input.repo,
          tag_name: input.tagName,
          target_commitish: input.targetCommitish,
          name: input.name ?? input.tagName,
          body: input.body,
          prerelease: input.prerelease ?? false,
          draft: true,
        }),
      "repos.createRelease(draft)"
    );

    await recordActionResult({ actor, action: ACTION, target });
    return data;
  } catch (err) {
    await recordActionResult({ actor, action: ACTION, target, error: err });
    throw err;
  }
}
