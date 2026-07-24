import { GithubActorContext, clientFromActor, callGithub } from "../shared/githubWriteClient";
import { assertRepoPermission } from "../shared/permissionCheck";
import { checkRateLimit } from "../shared/rateLimit";
import { recordActionResult } from "../shared/auditLog";

export interface SetIssueMilestoneInput {
  owner: string;
  repo: string;
  issueNumber: number;
  /** Milestone number, or null to clear the milestone */
  milestoneNumber: number | null;
}

const ACTION = "issues.milestone";

export async function setIssueMilestone(actor: GithubActorContext, input: SetIssueMilestoneInput) {
  const target = `${input.owner}/${input.repo}#${input.issueNumber}`;
  try {
    await assertRepoPermission(actor, input.owner, input.repo, "write");
    checkRateLimit(actor.userId, ACTION);

    const client = clientFromActor(actor);
    const { data } = await callGithub(
      () =>
        client.issues.update({
          owner: input.owner,
          repo: input.repo,
          issue_number: input.issueNumber,
          milestone: input.milestoneNumber,
        }),
      "issues.update(milestone)"
    );

    await recordActionResult({ actor, action: ACTION, target, metadata: { milestoneNumber: input.milestoneNumber } });
    return data;
  } catch (err) {
    await recordActionResult({ actor, action: ACTION, target, error: err });
    throw err;
  }
}
