import { useEffect, useRef } from "react";

/**
 * Calls `callback` immediately, then every `intervalMs`. This replaces
 * websocket-driven live updates — same end result (data refreshes without
 * a manual reload) but pull-based instead of push-based, since Vercel's
 * serverless functions can't hold a persistent WebSocket connection.
 */
export function usePolling(callback: () => void, intervalMs = 5000): void {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    callbackRef.current();
    const interval = setInterval(() => callbackRef.current(), intervalMs);
    return () => clearInterval(interval);
  }, [intervalMs]);
}
