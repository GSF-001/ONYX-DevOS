import { GithubActorContext, clientFromActor, callGithub } from "../shared/githubWriteClient";
import { assertRepoPermission } from "../shared/permissionCheck";
import { checkRateLimit } from "../shared/rateLimit";
import { recordActionResult } from "../shared/auditLog";

export interface CloseIssueInput {
  owner: string;
  repo: string;
  issueNumber: number;
  stateReason?: "completed" | "not_planned";
}

const ACTION = "issues.close";

export async function closeIssue(actor: GithubActorContext, input: CloseIssueInput) {
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
          state: "closed",
          state_reason: input.stateReason ?? "completed",
        }),
      "issues.update(close)"
    );

    await recordActionResult({ actor, action: ACTION, target });
    return data;
  } catch (err) {
    await recordActionResult({ actor, action: ACTION, target, error: err });
    throw err;
  }
}
