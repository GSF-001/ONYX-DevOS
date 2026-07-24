import { GithubActorContext, clientFromActor, callGithub } from "../shared/githubWriteClient";
import { assertRepoPermission } from "../shared/permissionCheck";
import { checkRateLimit } from "../shared/rateLimit";
import { recordActionResult } from "../shared/auditLog";

export interface AssignIssueInput {
  owner: string;
  repo: string;
  issueNumber: number;
  assignees: string[];
}

const ACTION = "issues.assign";

export async function assignIssue(actor: GithubActorContext, input: AssignIssueInput) {
  const target = `${input.owner}/${input.repo}#${input.issueNumber}`;
  try {
    await assertRepoPermission(actor, input.owner, input.repo, "triage");
    checkRateLimit(actor.userId, ACTION);

    const client = clientFromActor(actor);
    const { data } = await callGithub(
      () =>
        client.issues.addAssignees({
          owner: input.owner,
          repo: input.repo,
          issue_number: input.issueNumber,
          assignees: input.assignees,
        }),
      "issues.addAssignees"
    );

    await recordActionResult({ actor, action: ACTION, target, metadata: { assignees: input.assignees } });
    return data;
  } catch (err) {
    await recordActionResult({ actor, action: ACTION, target, error: err });
    throw err;
  }
}
