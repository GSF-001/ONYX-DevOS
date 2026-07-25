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

import { Calendar } from "./Calendar";
import { LiveIndicator } from "./LiveIndicator";
import { NetworkStatus } from "./NetworkStatus";
import { NotificationCounter } from "./NotificationCounter";

export function Tray() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "0 8px" }}>
      <LiveIndicator />
      <NetworkStatus />
      <NotificationCounter />
      <Calendar />
    </div>
  );
}
