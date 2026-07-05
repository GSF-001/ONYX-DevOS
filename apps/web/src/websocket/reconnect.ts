export interface ReconnectController {
  scheduleReconnect: (attempt: () => void) => void;
  reset: () => void;
  cancel: () => void;
}

/**
 * Exponential backoff scheduler for websocket reconnect attempts (mirrors
 * the retry strategy the server uses for webhook processing, so both sides
 * of the app back off the same way). Caps at 30s between attempts.
 */
export function createReconnectController(): ReconnectController {
  let attemptCount = 0;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const scheduleReconnect = (attempt: () => void) => {
    const delay = Math.min(30_000, 1000 * 2 ** attemptCount);
    const jitter = Math.random() * delay * 0.2;
    attemptCount += 1;

    timeoutId = setTimeout(attempt, delay + jitter);
  };

  const reset = () => {
    attemptCount = 0;
  };

  const cancel = () => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = null;
  };

  return { scheduleReconnect, reset, cancel };
}
