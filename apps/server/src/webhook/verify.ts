import { eq } from "drizzle-orm";
import { db } from "../db/client.js";
import { webhookEvents } from "../db/schema.js";
import { verifySignature } from "./signature.js";

export interface VerifyResult {
  ok: boolean;
  reason?: "bad_signature" | "duplicate_delivery";
}

export async function verifyWebhookRequest(
  rawBody: Buffer,
  signatureHeader: string | undefined,
  deliveryId: string
): Promise<VerifyResult> {
  if (!verifySignature(rawBody, signatureHeader)) {
    return { ok: false, reason: "bad_signature" };
  }

  const existing = await db
    .select({ id: webhookEvents.id })
    .from(webhookEvents)
    .where(eq(webhookEvents.deliveryId, deliveryId))
    .limit(1);

  if (existing.length > 0) {
    return { ok: false, reason: "duplicate_delivery" };
  }

  return { ok: true };
}
