/**
 * ONYX DevOS
 * Copyright (c) 2026 GSF-001
 * All rights reserved.
 */

import { useState } from "react";
import type { useSettings } from "./SettingsHooks";
import { Appearance } from "./Appearance";
import { Sounds } from "./Sounds";
import { Notifications } from "./Notifications";
import { Workspace } from "./Workspace";
import { Integrations } from "./Integrations";
import { Keyboard } from "./Keyboard";

type Tab = "appearance" | "sounds" | "notifications" | "workspace" | "integrations" | "advanced";

const TABS: { id: Tab; label: string }[] = [
  { id: "appearance", label: "Settings" },
  { id: "sounds", label: "Sounds" },
  { id: "notifications", label: "Notifications" },
  { id: "workspace", label: "Workspace" },
  { id: "integrations", label: "Integrations" },
  { id: "advanced", label: "Advanced" },
];

export function SettingsWindow({ settings }: { settings: ReturnType<typeof useSettings> }) {
  const [tab, setTab] = useState<Tab>("appearance");

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ display: "flex", borderBottom: "1px solid var(--win-face-dark)", padding: "0 4px" }}>
        {TABS.map((t) => (
          <div
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: "6px 10px",
              fontSize: 12,
              cursor: "default",
              borderBottom: tab === t.id ? "2px solid var(--win-accent)" : "2px solid transparent",
              fontWeight: tab === t.id ? 600 : 400,
            }}
          >
            {t.label}
          </div>
        ))}
      </div>
      <div style={{ flex: 1, overflowY: "auto" }}>
        {tab === "appearance" && <Appearance settings={settings} />}
        {tab === "sounds" && <Sounds settings={settings} />}
        {tab === "notifications" && <Notifications />}
        {tab === "workspace" && <Workspace settings={settings} />}
        {tab === "integrations" && <Integrations />}
        {tab === "advanced" && <Keyboard />}
      </div>
    </div>
  );
}
