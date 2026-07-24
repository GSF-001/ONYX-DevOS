import { GithubActorContext, clientFromActor, callGithub } from "../shared/githubWriteClient";
import { assertRepoPermission } from "../shared/permissionCheck";
import { checkRateLimit } from "../shared/rateLimit";
import { recordActionResult } from "../shared/auditLog";

export interface AddLabelToIssueInput {
  owner: string;
  repo: string;
  issueNumber: number;
  labels: string[];
}

const ACTION = "issues.addLabel";

export async function addLabelToIssue(actor: GithubActorContext, input: AddLabelToIssueInput) {
  const target = `${input.owner}/${input.repo}#${input.issueNumber}`;
  try {
    await assertRepoPermission(actor, input.owner, input.repo, "triage");
    checkRateLimit(actor.userId, ACTION);

    const client = clientFromActor(actor);
    const { data } = await callGithub(
      () =>
        client.issues.addLabels({
          owner: input.owner,
          repo: input.repo,
          issue_number: input.issueNumber,
          labels: input.labels,
        }),
      "issues.addLabels"
    );

    await recordActionResult({ actor, action: ACTION, target, metadata: { labels: input.labels } });
    return data;
  } catch (err) {
    await recordActionResult({ actor, action: ACTION, target, error: err });
    throw err;
  }
}
