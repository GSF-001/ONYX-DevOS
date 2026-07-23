import type { ParsedWebhookEvent } from "./parser.js";
import { handlePush } from "./onPush.js";
import { handlePullRequest } from "./onPullRequest.js";
import { handleReview } from "./onReview.js";
import { handleIssue } from "./onIssue.js";
import { handleCheckRun } from "./onCheckRun.js";
import { onRelease, type ReleaseWebhookPayload } from "./onRelease.js";
import { onWorkflow, type WorkflowRunWebhookPayload } from "./onWorkflow.js";
import { onMember, type MemberWebhookPayload } from "./onMember.js";
import { onLabel, type LabelWebhookPayload } from "./onLabel.js";
import { onMilestone, type MilestoneWebhookPayload } from "./onMilestone.js";
import { logger } from "../services/logger.js";

type Handler = (event: ParsedWebhookEvent) => Promise<void>;

const HANDLERS: Record<string, Handler> = {
  push: handlePush,
  pull_request: handlePullRequest,
  pull_request_review: handleReview,
  issues: handleIssue,
  check_run: handleCheckRun,
  release: (event) => onRelease(event.payload as ReleaseWebhookPayload),
  workflow_run: (event) => onWorkflow(event.payload as WorkflowRunWebhookPayload),
  member: (event) => onMember(event.payload as MemberWebhookPayload),
  label: (event) => onLabel(event.payload as LabelWebhookPayload),
  milestone: (event) => onMilestone(event.payload as MilestoneWebhookPayload),
};

export async function dispatchWebhookEvent(event: ParsedWebhookEvent): Promise<void> {
  const handler = HANDLERS[event.event];
  if (!handler) {
    logger.debug({ event: event.event }, "No handler registered for webhook event, skipping");
    return;
  }
  await handler(event);
}
