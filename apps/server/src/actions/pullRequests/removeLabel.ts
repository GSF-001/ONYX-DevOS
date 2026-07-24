import { GithubActorContext, clientFromActor, callGithub } from "../shared/githubWriteClient";
import { assertRepoPermission } from "../shared/permissionCheck";
import { checkRateLimit } from "../shared/rateLimit";
import { recordActionResult } from "../shared/auditLog";

export interface RemoveLabelFromPullRequestInput {
  owner: string;
  repo: string;
  pullNumber: number;
  label: string;
}

const ACTION = "pulls.removeLabel";

export async function removeLabelFromPullRequest(actor: GithubActorContext, input: RemoveLabelFromPullRequestInput) {
  const target = `${input.owner}/${input.repo}#${input.pullNumber}`;
  try {
    await assertRepoPermission(actor, input.owner, input.repo, "triage");
    checkRateLimit(actor.userId, ACTION);

    const client = clientFromActor(actor);
    const { data } = await callGithub(
      () =>
        client.issues.removeLabel({
          owner: input.owner,
          repo: input.repo,
          issue_number: input.pullNumber,
          name: input.label,
        }),
      "issues.removeLabel"
    );

    await recordActionResult({ actor, action: ACTION, target, metadata: { label: input.label } });
    return data;
  } catch (err) {
    await recordActionResult({ actor, action: ACTION, target, error: err });
    throw err;
  }
}
