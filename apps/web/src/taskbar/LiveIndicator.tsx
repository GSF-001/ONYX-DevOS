/**
 * ONYX DevOS — Developer Operating System
 * © 2026 GSF-001
 *
 * Proprietary Software.
 * Unauthorized use is strictly prohibited.
 */

/**
 * ONYX DevOS
 * Copyright (c) 2026 GSF-001
 * All rights reserved.
 */

import { useWebSocket } from "../shared/hooks";

export function LiveIndicator() {
  const { isConnected } = useWebSocket();

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontSize: 11,
        fontFamily: "var(--win-font-mono)",
        color: isConnected ? "var(--win-success)" : "var(--win-text-dim)",
      }}
    >
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: isConnected ? "var(--win-success)" : "var(--win-text-dim)",
        }}
      />
      {isConnected ? "LIVE SYNC" : "OFFLINE"}
    </span>
  );
}
