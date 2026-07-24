import { GithubActorContext, clientFromActor, callGithub } from "../shared/githubWriteClient";
import { assertRepoPermission } from "../shared/permissionCheck";
import { checkRateLimit } from "../shared/rateLimit";
import { recordActionResult } from "../shared/auditLog";

export interface CreateBranchInput {
  owner: string;
  repo: string;
  /** New branch name, e.g. "feature/my-branch" (no refs/heads/ prefix) */
  branchName: string;
  /** SHA or ref to branch from, e.g. "main" or a commit SHA */
  fromRef: string;
}

const ACTION = "repository.createBranch";

export async function createBranch(actor: GithubActorContext, input: CreateBranchInput) {
  const target = `${input.owner}/${input.repo}:${input.branchName}`;
  try {
    await assertRepoPermission(actor, input.owner, input.repo, "write");
    checkRateLimit(actor.userId, ACTION);

    const client = clientFromActor(actor);

    // Resolve fromRef to a commit SHA (accepts branch names, tags, or SHAs)
    const { data: refData } = await callGithub(
      () => client.repos.getCommit({ owner: input.owner, repo: input.repo, ref: input.fromRef }),
      "repos.getCommit"
    );

    const { data } = await callGithub(
      () =>
        client.git.createRef({
          owner: input.owner,
          repo: input.repo,
          ref: `refs/heads/${input.branchName}`,
          sha: refData.sha,
        }),
      "git.createRef"
    );

    await recordActionResult({ actor, action: ACTION, target, metadata: { fromRef: input.fromRef, sha: refData.sha } });
    return data;
  } catch (err) {
    await recordActionResult({ actor, action: ACTION, target, error: err });
    throw err;
  }
}
