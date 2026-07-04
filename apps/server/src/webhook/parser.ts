export interface ParsedWebhookEvent {
  event: string;
  action?: string;
  repositoryFullName?: string;
  repositoryGithubId?: number;
  raw: Record<string, unknown>;
}

export function parseWebhookPayload(
  eventName: string,
  payload: Record<string, unknown>
): ParsedWebhookEvent {
  const repo = payload.repository as
    | { id?: number; full_name?: string }
    | undefined;

  return {
    event: eventName,
    action: typeof payload.action === "string" ? payload.action : undefined,
    repositoryFullName: repo?.full_name,
    repositoryGithubId: repo?.id,
    raw: payload,
  };
}
