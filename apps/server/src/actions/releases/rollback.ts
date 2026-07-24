import { GithubActorContext, clientFromActor, callGithub } from "../shared/githubWriteClient";
import { assertRepoPermission } from "../shared/permissionCheck";
import { checkRateLimit } from "../shared/rateLimit";
import { recordActionResult } from "../shared/auditLog";

export interface RollbackReleaseInput {
  owner: string;
  repo: string;
  releaseId: number;
  tagName: string;
  /** Also delete the underlying git tag ref, not just the release object */
  deleteTag?: boolean;
}

const ACTION = "releases.rollback";

/**
 * Rolls back a release by deleting the release object and, optionally,
 * its underlying tag ref. This is destructive and admin-gated.
 */
export async function rollbackRelease(actor: GithubActorContext, input: RollbackReleaseInput) {
  const target = `${input.owner}/${input.repo}#release:${input.releaseId}`;
  try {
    await assertRepoPermission(actor, input.owner, input.repo, "admin");
    checkRateLimit(actor.userId, ACTION);

    const client = clientFromActor(actor);

    await callGithub(
      () =>
        client.repos.deleteRelease({
          owner: input.owner,
          repo: input.repo,
          release_id: input.releaseId,
        }),
      "repos.deleteRelease"
    );

    if (input.deleteTag) {
      await callGithub(
        () =>
          client.git.deleteRef({
            owner: input.owner,
            repo: input.repo,
            ref: `tags/${input.tagName}`,
          }),
        "git.deleteRef(tag)"
      );
    }

    await recordActionResult({ actor, action: ACTION, target, metadata: { deleteTag: !!input.deleteTag } });
    return { rolledBack: true, releaseId: input.releaseId, tagDeleted: !!input.deleteTag };
  } catch (err) {
    await recordActionResult({ actor, action: ACTION, target, error: err });
    throw err;
  }
}
