/**
 * ONYX DevOS
 * Copyright (c) 2026 GSF-001
 * All rights reserved.
 */

import { useState } from "react";

type NavItem =
  | "overview" | "reputation" | "achievements" | "badges"
  | "contributions" | "plugins" | "bounties" | "repositories" | "settings";

const NAV_ITEMS: { id: NavItem; label: string; icon: string }[] = [
  { id: "overview", label: "Overview", icon: "◱" },
  { id: "reputation", label: "Reputation", icon: "★" },
  { id: "achievements", label: "Achievements", icon: "★" },
  { id: "badges", label: "Badges", icon: "◆" },
  { id: "contributions", label: "Contributions", icon: "▤" },
  { id: "plugins", label: "Plugins", icon: "▣" },
  { id: "bounties", label: "Bounties", icon: "★" },
  { id: "repositories", label: "Repositories", icon: "▥" },
  { id: "settings", label: "Settings", icon: "⚙" },
];

const PROFILE = {
  handle: "ONYX://PIXEL",
  developerId: "#8A31F9",
  memberSince: "10/05/26",
  reputation: 8.4,
  bountiesCompleted: 37,
  pluginsPublished: 5,
  repositoriesConnected: 12,
  online: true,
};

function StarRow({ score }: { score: number }) {
  const full = Math.round(score / 2);
  return (
    <span style={{ letterSpacing: 1 }}>
      <span style={{ color: "var(--win-accent)" }}>{"★".repeat(full)}</span>
      <span style={{ color: "var(--win-face-dark)" }}>{"★".repeat(5 - full)}</span>
    </span>
  );
}

const sidebarItemStyle = (active: boolean): React.CSSProperties => ({
  padding: "6px 10px",
  fontSize: 12,
  cursor: "pointer",
  display: "flex",
  gap: 6,
  alignItems: "center",
  background: active ? "var(--win-titlebar-active)" : "transparent",
  color: active ? "var(--win-titlebar-text)" : "var(--win-text)",
});

const statRowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  padding: "8px 0",
  borderBottom: "1px solid var(--win-face-dark)",
  fontSize: 13,
};

export default function ProfileApp() {
  const [active, setActive] = useState<NavItem>("overview");

  return (
    <div style={{ display: "flex", height: "100%", fontSize: 13 }}>
      {/* Sidebar */}
      <div
        style={{
          width: 150,
          borderRight: "1px solid var(--win-border)",
          background: "var(--win-face)",
          padding: "8px 0",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {NAV_ITEMS.map((item) => (
          <div
            key={item.id}
            style={sidebarItemStyle(active === item.id)}
            onClick={() => setActive(item.id)}
          >
            <span style={{ width: 14, textAlign: "center" }}>{item.icon}</span>
            {item.label}
          </div>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: 16, display: "flex", flexDirection: "column" }}>
        {active === "overview" && (
          <>
            <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 20 }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "var(--win-radius)",
                  background: "linear-gradient(135deg, var(--win-accent), var(--win-success))",
                  border: "1px solid var(--win-border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 24,
                  fontWeight: 700,
                  color: "var(--win-titlebar-text)",
                }}
              >
                ⬡
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: 16 }}>{PROFILE.handle}</h2>
                <p style={{ margin: "4px 0 0 0", fontSize: 11, color: "var(--win-text-dim)" }}>
                  Developer ID: {PROFILE.developerId}
                </p>
                <p style={{ margin: "2px 0 0 0", fontSize: 11, color: "var(--win-text-dim)" }}>
                  Member since: {PROFILE.memberSince}
                </p>
              </div>
            </div>

            <div
              style={{
                border: "1px solid var(--win-border)",
                background: "var(--win-face-light)",
                borderRadius: "var(--win-radius)",
                padding: "4px 16px",
              }}
            >
              <div style={statRowStyle}>
                <span>Reputation</span>
                <span>
                  {PROFILE.reputation.toFixed(1)} <StarRow score={PROFILE.reputation} />
                </span>
              </div>
              <div style={statRowStyle}>
                <span>Bounties Completed</span>
                <span>{PROFILE.bountiesCompleted}</span>
              </div>
              <div style={statRowStyle}>
                <span>Plugins Published</span>
                <span>{PROFILE.pluginsPublished}</span>
              </div>
              <div style={{ ...statRowStyle, borderBottom: "none" }}>
                <span>Repositories Connected</span>
                <span>{PROFILE.repositoriesConnected}</span>
              </div>
            </div>

            <div style={{ flex: 1 }} />

            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "var(--win-text-dim)" }}>
              <span style={{ color: "var(--win-success)" }}>●</span>
              Status: {PROFILE.online ? "Online" : "Offline"}
            </div>
          </>
        )}

        {active !== "overview" && (
          <p style={{ color: "var(--win-text-dim)", fontSize: 12 }}>
            {NAV_ITEMS.find((n) => n.id === active)?.label} — coming soon.
          </p>
        )}
      </div>
    </div>
  );
}

