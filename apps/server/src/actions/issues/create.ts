import { GithubActorContext, clientFromActor, callGithub } from "../shared/githubWriteClient";
import { assertRepoPermission } from "../shared/permissionCheck";
import { checkRateLimit } from "../shared/rateLimit";
import { recordActionResult } from "../shared/auditLog";

export interface CreateIssueInput {
  owner: string;
  repo: string;
  title: string;
  body?: string;
  assignees?: string[];
  labels?: string[];
  milestone?: number;
}

const ACTION = "issues.create";

export async function createIssue(actor: GithubActorContext, input: CreateIssueInput) {
  const target = `${input.owner}/${input.repo}`;
  try {
    await assertRepoPermission(actor, input.owner, input.repo, "write");
    checkRateLimit(actor.userId, ACTION);

    const client = clientFromActor(actor);
    const { data } = await callGithub(
      () =>
        client.issues.create({
          owner: input.owner,
          repo: input.repo,
          title: input.title,
          body: input.body,
          assignees: input.assignees,
          labels: input.labels,
          milestone: input.milestone,
        }),
      "issues.create"
    );

    await recordActionResult({ actor, action: ACTION, target: `${target}#${data.number}` });
    return data;
  } catch (err) {
    await recordActionResult({ actor, action: ACTION, target, error: err });
    throw err;
  }
}
