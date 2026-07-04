import type { FastifyReply, FastifyRequest } from "fastify";
import { verifyWebhookRequest } from "./verify.js";
import { parseWebhookPayload } from "./parser.js";
import {
  incrementWebhookAttempts,
  logWebhookEvent,
  markWebhookEventFailed,
  markWebhookEventProcessed,
} from "./logger.js";
import { dispatchWebhookEvent } from "./dispatcher.js";
import { webhookQueue } from "./queue.js";
import { withRetry } from "./retry.js";
import { logger } from "../services/logger.js";

interface WebhookRequest extends FastifyRequest {
  rawBody?: Buffer;
}

export async function handleGithubWebhook(
  request: WebhookRequest,
  reply: FastifyReply
): Promise<void> {
  const rawBody = request.rawBody ?? Buffer.from(JSON.stringify(request.body));
  const signature = request.headers["x-hub-signature-256"] as string | undefined;
  const deliveryId = request.headers["x-github-delivery"] as string | undefined;
  const eventName = request.headers["x-github-event"] as string | undefined;

  if (!deliveryId || !eventName) {
    reply.code(400).send({ error: "Missing required GitHub webhook headers" });
    return;
  }

  const verification = await verifyWebhookRequest(rawBody, signature, deliveryId);
  if (!verification.ok) {
    if (verification.reason === "duplicate_delivery") {
      reply.code(200).send({ ok: true, note: "duplicate delivery, already processed" });
      return;
    }
    reply.code(401).send({ error: "Invalid webhook signature" });
    return;
  }

  const payload = request.body as Record<string, unknown>;
  const parsed = parseWebhookPayload(eventName, payload);

  const eventRow = await logWebhookEvent({
    deliveryId,
    event: parsed.event,
    action: parsed.action,
    repositoryFullName: parsed.repositoryFullName,
    payload,
  });

  reply.code(202).send({ ok: true, id: eventRow.id });

  webhookQueue.enqueue(async () => {
    try {
      await withRetry(() => dispatchWebhookEvent(parsed), { maxAttempts: 3 });
      await markWebhookEventProcessed(eventRow.id);
    } catch (err) {
      await incrementWebhookAttempts(eventRow.id);
      await markWebhookEventFailed(eventRow.id, err instanceof Error ? err.message : String(err));
      logger.error({ err, deliveryId }, "Webhook event processing failed permanently");
    }
  });
}
