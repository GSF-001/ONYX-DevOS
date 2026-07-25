/**
 * ONYX DevOS
 * Copyright (c) 2026 GSF-001
 * All rights reserved.
 */

import { WindowToolbar } from "../../window-manager";

interface DashboardToolbarProps {
  onRefresh: () => void;
  onOpenInsights: () => void;
}

export function DashboardToolbar({ onRefresh, onOpenInsights }: DashboardToolbarProps) {
  return (
    <WindowToolbar>
      <button className="win-button" style={{ width: "auto", padding: "0 8px" }} onClick={onRefresh}>
        ↻ Refresh
      </button>
      <button className="win-button" style={{ width: "auto", padding: "0 8px" }} onClick={onOpenInsights}>
        View Insights
      </button>
    </WindowToolbar>
  );
}
