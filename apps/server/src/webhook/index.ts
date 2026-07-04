import type { FastifyInstance } from "fastify";
import { handleGithubWebhook } from "./handler.js";

export async function webhookPlugin(app: FastifyInstance): Promise<void> {
  app.addContentTypeParser(
    "application/json",
    { parseAs: "buffer" },
    (request, body, done) => {
      (request as unknown as { rawBody: Buffer }).rawBody = body as Buffer;
      try {
        const json = body.length ? JSON.parse((body as Buffer).toString("utf-8")) : {};
        done(null, json);
      } catch (err) {
        done(err as Error, undefined);
      }
    }
  );

  app.post("/webhook/github", handleGithubWebhook);
}

export { dispatchWebhookEvent } from "./dispatcher.js";
export { webhookQueue } from "./queue.js";
