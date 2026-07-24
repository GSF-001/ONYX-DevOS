import { GithubActorContext, clientFromActor, callGithub } from "../shared/githubWriteClient";
import { assertRepoPermission } from "../shared/permissionCheck";
import { checkRateLimit } from "../shared/rateLimit";
import { recordActionResult } from "../shared/auditLog";

export interface ConvertToDraftInput {
  owner: string;
  repo: string;
  pullNumber: number;
}

const ACTION = "pulls.convertDraft";

/**
 * Converts an open PR back to draft status. The REST API has no
 * endpoint for this — it requires the `convertPullRequestToDraft`
 * GraphQL mutation, which operates on the PR's GraphQL node id.
 */
export async function convertToDraft(actor: GithubActorContext, input: ConvertToDraftInput) {
  const target = `${input.owner}/${input.repo}#${input.pullNumber}`;
  try {
    await assertRepoPermission(actor, input.owner, input.repo, "write");
    checkRateLimit(actor.userId, ACTION);

    const client = clientFromActor(actor);

    const { data: pr } = await callGithub(
      () => client.pulls.get({ owner: input.owner, repo: input.repo, pull_number: input.pullNumber }),
      "pulls.get"
    );

    const result = await callGithub(
      () =>
        client.graphql<{ convertPullRequestToDraft: { pullRequest: { id: string; isDraft: boolean } } }>(
          `mutation($pullRequestId: ID!) {
            convertPullRequestToDraft(input: { pullRequestId: $pullRequestId }) {
              pullRequest { id isDraft }
            }
          }`,
          { pullRequestId: (pr as any).node_id }
        ),
      "graphql.convertPullRequestToDraft"
    );

    await recordActionResult({ actor, action: ACTION, target });
    return result.convertPullRequestToDraft.pullRequest;
  } catch (err) {
    await recordActionResult({ actor, action: ACTION, target, error: err });
    throw err;
  }
}
