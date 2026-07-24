import { GithubActorContext, clientFromActor, callGithub } from "../shared/githubWriteClient";
import { assertRepoPermission } from "../shared/permissionCheck";
import { checkRateLimit } from "../shared/rateLimit";
import { recordActionResult } from "../shared/auditLog";

export interface CommentOnPullRequestInput {
  owner: string;
  repo: string;
  pullNumber: number;
  body: string;
}

const ACTION = "pulls.comment";

export async function commentOnPullRequest(actor: GithubActorContext, input: CommentOnPullRequestInput) {
  const target = `${input.owner}/${input.repo}#${input.pullNumber}`;
  try {
    await assertRepoPermission(actor, input.owner, input.repo, "read");
    checkRateLimit(actor.userId, ACTION);

    const client = clientFromActor(actor);
    const { data } = await callGithub(
      () =>
        client.issues.createComment({
          owner: input.owner,
          repo: input.repo,
          issue_number: input.pullNumber,
          body: input.body,
        }),
      "issues.createComment"
    );

    await recordActionResult({ actor, action: ACTION, target });
    return data;
  } catch (err) {
    await recordActionResult({ actor, action: ACTION, target, error: err });
    throw err;
  }
}
