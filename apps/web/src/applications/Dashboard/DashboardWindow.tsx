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

import { useState } from "react";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardToolbar } from "./DashboardToolbar";
import { DashboardStatus } from "./DashboardStatus";
import { DashboardOverview } from "./DashboardOverview";
import { DashboardQuickLaunch } from "./DashboardQuickLaunch";
import { ConnectRepositoryModal } from "./ConnectRepositoryModal";
import { EmptyState, LoadingSpinner } from "../../shared/components";
import { useWindowManager } from "../../window-manager";
import type { useDashboardData } from "./DashboardHooks";
import { DashboardAPI } from "./DashboardAPI";
import { formatRelativeTime } from "../../shared/utils";

interface DashboardWindowProps {
  data: ReturnType<typeof useDashboardData>;
}

export function DashboardWindow({ data }: DashboardWindowProps) {
  const manager = useWindowManager();
  const [syncing, setSyncing] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);

  if (data.loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: 48 }}>
        <LoadingSpinner label="Loading dashboard..." />
      </div>
    );
  }

  if (data.error) {
    return <EmptyState title="Couldn't load dashboard" description={data.error} />;
  }

  if (data.repositories.length === 0) {
    return (
      <>
        <EmptyState
          title="No repositories connected"
          description="Connect a GitHub repository to start seeing data here."
        />
        <div style={{ display: "flex", justifyContent: "center", marginTop: 12 }}>
          <button className="win-button" style={{ width: "auto", padding: "6px 16px" }} onClick={() => setShowConnectModal(true)}>
            + Connect Repository
          </button>
        </div>
        {showConnectModal && (
          <ConnectRepositoryModal
            onClose={() => setShowConnectModal(false)}
            onConnected={() => void data.reload()}
          />
        )}
      </>
    );
  }

  const selectedRepo = data.repositories.find((r) => r.id === data.selectedRepositoryId);
  const selectedScore = data.scores.find((s) => s.repositoryId === data.selectedRepositoryId);

  const handleSync = async () => {
    if (!data.selectedRepositoryId) return;
    setSyncing(true);
    try {
      await DashboardAPI.syncRepository(data.selectedRepositoryId);
      await data.reload();
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="win-desktop" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <DashboardToolbar onRefresh={() => void data.reload()} onOpenInsights={() => manager.open("insights")} />
      <DashboardHeader
        repository={selectedRepo as any}
        onSync={handleSync}
        syncing={syncing}
      />
      <div className="dashboard-body" style={{ display: "flex", flex: 1, minHeight: 0 }}>
        <DashboardSidebar
          repositories={data.repositories}
          selectedId={data.selectedRepositoryId}
          onSelect={data.selectRepository}
          onConnectNew={() => setShowConnectModal(true)}
        />

        <div className="dashboard-main">
          <DashboardOverview
            repositories={data.repositories}
            scores={data.scores}
            selectedRepositoryId={data.selectedRepositoryId}
            trend={data.trend}
            activity={data.activity}
            insights={data.insights}
            syncing={syncing}
          />
        </div>

        <div className="dashboard-right">
          <div className="dashboard-panel">
            <DashboardStatus score={selectedScore?.activityScore} />
          </div>

          <div className="dashboard-panel dashboard-widget">
            <p className="dashboard-section-title">SYSTEM INFORMATION</p>
            <div className="dashboard-metric">
              <span>Repositories connected</span>
              <span>{data.repositories.length}</span>
            </div>
            <div className="dashboard-metric">
              <span>Selected repository ID</span>
              <span>{data.selectedRepositoryId ?? "—"}</span>
            </div>
            <div className="dashboard-metric">
              <span>Insights generated</span>
              <span>{data.insights ? formatRelativeTime(data.insights.generatedAt) : "—"}</span>
            </div>
          </div>

          <div className="dashboard-panel dashboard-actions">
            <p className="dashboard-section-title">QUICK ACTIONS</p>
            <DashboardQuickLaunch />
          </div>
        </div>
      </div>

      {showConnectModal && (
        <ConnectRepositoryModal
          onClose={() => setShowConnectModal(false)}
          onConnected={() => void data.reload()}
        />
      )}
    </div>
  );
}
