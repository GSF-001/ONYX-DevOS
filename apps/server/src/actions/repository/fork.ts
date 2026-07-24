import { GithubActorContext, clientFromActor, callGithub } from "../shared/githubWriteClient";
import { assertRepoPermission } from "../shared/permissionCheck";
import { checkRateLimit } from "../shared/rateLimit";
import { recordActionResult } from "../shared/auditLog";

export interface ForkRepositoryInput {
  owner: string;
  repo: string;
  /** Optional target organization to fork into; defaults to the actor's account */
  organization?: string;
  /** Optional new name for the fork */
  name?: string;
  defaultBranchOnly?: boolean;
}

const ACTION = "repository.fork";

export async function forkRepository(actor: GithubActorContext, input: ForkRepositoryInput) {
  const target = `${input.owner}/${input.repo}`;
  try {
    await assertRepoPermission(actor, input.owner, input.repo, "read");
    checkRateLimit(actor.userId, ACTION);

    const client = clientFromActor(actor);
    const { data } = await callGithub(
      () =>
        client.repos.createFork({
          owner: input.owner,
          repo: input.repo,
          organization: input.organization,
          name: input.name,
          default_branch_only: input.defaultBranchOnly,
        }),
      "repos.createFork"
    );

    await recordActionResult({ actor, action: ACTION, target, metadata: { forkFullName: (data as any).full_name } });
    return data;
  } catch (err) {
    await recordActionResult({ actor, action: ACTION, target, error: err });
    throw err;
  }
}
