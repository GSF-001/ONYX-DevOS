import { db } from "../db/client";
import { logger } from "../services/logger";
import { broadcast } from "../websocket/broadcast";
import { createNotification } from "../services/notifications";

/**
 * onWorkflow.ts
 * Handles GitHub's `workflow_run` webhook event (GitHub Actions runs).
 * Docs: https://docs.github.com/en/webhooks/webhook-events-and-payloads#workflow_run
 */

type WorkflowRunAction = "requested" | "in_progress" | "completed";
type WorkflowConclusion =
  | "success"
  | "failure"
  | "neutral"
  | "cancelled"
  | "timed_out"
  | "action_required"
  | "stale"
  | "skipped"
  | null;

interface GithubWorkflowRun {
  id: number;
  name: string | null;
  head_branch: string;
  head_sha: string;
  path: string;
  run_number: number;
  event: string;
  status: "queued" | "in_progress" | "completed" | "waiting";
  conclusion: WorkflowConclusion;
  workflow_id: number;
  html_url: string;
  created_at: string;
  updated_at: string;
  run_started_at: string;
  actor: { login: string; id: number };
  triggering_actor: { login: string; id: number };
}

interface GithubRepository {
  id: number;
  full_name: string;
  name: string;
}

export interface WorkflowRunWebhookPayload {
  action: WorkflowRunAction;
  workflow_run: GithubWorkflowRun;
  workflow: { id: number; name: string; path: string };
  repository: GithubRepository;
  sender: { login: string; id: number };
}

function durationSeconds(run: GithubWorkflowRun): number | null {
  if (run.status !== "completed") return null;
  const started = new Date(run.run_started_at).getTime();
  const ended = new Date(run.updated_at).getTime();
  if (Number.isNaN(started) || Number.isNaN(ended) || ended < started) return null;
  return Math.round((ended - started) / 1000);
}

export async function onWorkflow(payload: WorkflowRunWebhookPayload): Promise<void> {
  const { action, workflow_run: run, workflow, repository } = payload;

  logger.info("webhook.onWorkflow: received", {
    action,
    repo: repository.full_name,
    workflow: workflow.name,
    status: run.status,
    conclusion: run.conclusion,
  });

  await db.query(
    `insert into workflow_runs (
       github_id, repository_id, workflow_id, workflow_name, run_number, event,
       head_branch, head_sha, status, conclusion, actor_login, html_url,
       duration_seconds, created_at, updated_at
     ) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, now())
     on conflict (github_id) do update set
       status = excluded.status,
       conclusion = excluded.conclusion,
       duration_seconds = excluded.duration_seconds,
       updated_at = now()`,
    [
      run.id,
      repository.id,
      workflow.id,
      workflow.name,
      run.run_number,
      run.event,
      run.head_branch,
      run.head_sha,
      run.status,
      run.conclusion,
      run.actor.login,
      run.html_url,
      durationSeconds(run),
      run.created_at,
    ],
  );

  if (action === "completed" && (run.conclusion === "failure" || run.conclusion === "timed_out")) {
    await createNotification({
      type: "workflow_failed",
      repositoryId: repository.id,
      title: `${workflow.name} failed on ${run.head_branch}`,
      body: `Run #${run.run_number} — ${run.conclusion} (triggered by ${run.actor.login})`,
      url: run.html_url,
    });
  }

  broadcast(`repo:${repository.id}:automation`, {
    event: "workflow_run.updated",
    action,
    run: {
      id: run.id,
      workflowName: workflow.name,
      status: run.status,
      conclusion: run.conclusion,
      headBranch: run.head_branch,
      runNumber: run.run_number,
      htmlUrl: run.html_url,
      durationSeconds: durationSeconds(run),
    },
    repository: { id: repository.id, fullName: repository.full_name },
  });

  logger.info("webhook.onWorkflow: processed", {
    action,
    status: run.status,
    conclusion: run.conclusion,
  });
}
