// StatusBar.tsx — thin informational strip under the desktop icons

import { LiveIndicator } from "./LiveIndicator";
import { NetworkStatus } from "./NetworkStatus";
import { CpuUsage } from "./CpuUsage";
import { MemoryUsage } from "./MemoryUsage";

interface StatusBarProps {
  eventsProcessed: number;
  repositoryFullName?: string;
}

export function StatusBar({ eventsProcessed, repositoryFullName }: StatusBarProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        height: 22,
        padding: "0 10px",
        fontSize: 11,
        color: "var(--win-text-dim)",
        background: "var(--win-face)",
        borderTop: "1px solid var(--win-face-dark)",
        boxShadow: "0 1px 0 var(--win-face-light) inset",
      }}
    >
      <span>READY</span>
      <span className="win-infobar-divider" />
      <LiveIndicator />
      <span className="win-infobar-divider" />
      <NetworkStatus />
      {repositoryFullName && (
        <>
          <span className="win-infobar-divider" />
          <span>WATCHING {repositoryFullName}</span>
        </>
      )}
      <span className="win-infobar-divider" />
      <span>{eventsProcessed.toLocaleString()} EVENTS</span>
      <div style={{ flex: 1 }} />
      <CpuUsage />
      <span className="win-infobar-divider" />
      <MemoryUsage />
    </div>
  );
}
