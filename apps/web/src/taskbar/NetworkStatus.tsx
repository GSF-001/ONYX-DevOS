import { useEffect, useState } from "react";
import { API_BASE_URL } from "../shared/api/client";

/** Measures real round-trip latency to the server's /health endpoint —
 * unlike Cpu/MemoryUsage, this one is an actual measurement. */
export function NetworkStatus() {
  const [latencyMs, setLatencyMs] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    const ping = async () => {
      const start = performance.now();
      try {
        await fetch(`${API_BASE_URL}/health`, { cache: "no-store" });
        if (!cancelled) setLatencyMs(Math.round(performance.now() - start));
      } catch {
        if (!cancelled) setLatencyMs(null);
      }
    };

    void ping();
    const interval = setInterval(ping, 15000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return (
    <span style={{ fontSize: 11, fontFamily: "var(--win-font-mono)", color: "var(--win-text-dim)" }}>
      LATENCY {latencyMs !== null ? `${latencyMs}ms` : "—"}
    </span>
  );
}
