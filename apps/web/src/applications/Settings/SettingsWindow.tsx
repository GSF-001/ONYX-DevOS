/**
 * ONYX DevOS — Developer Operating System
 * © 2026 GSF-001
 *
 * Proprietary Software.
 * Unauthorized use is strictly prohibited.
 */

import { useState } from "react";
import type { useSettings } from "./SettingsHooks";
import { Appearance } from "./Appearance";
import { Sounds } from "./Sounds";
import { Workspace } from "./Workspace";
import { Keyboard } from "./Keyboard";
import { About } from "./About";

type Tab = "appearance" | "sounds" | "workspace" | "keyboard" | "about";

const TABS: { id: Tab; label: string }[] = [
  { id: "appearance", label: "SETTINGS" },
  { id: "sounds", label: "Sounds" },
  { id: "workspace", label: "Workspace" },
  { id: "keyboard", label: "Keyboard" },
  { id: "about", label: "About" },
];

export function SettingsWindow({ settings }: { settings: ReturnType<typeof useSettings> }) {
  const [tab, setTab] = useState<Tab>("appearance");

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid var(--win-face-dark)",
          background: "var(--win-face)",
          flexShrink: 0,
        }}
      >
        {TABS.map((t) => (
          <div
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: "8px 16px",
              fontSize: 12,
              fontWeight: tab === t.id ? 700 : 400,
              cursor: "default",
              borderTop: "2px solid transparent",
              borderBottom: tab === t.id ? "2px solid var(--win-accent)" : "2px solid transparent",
              background: tab === t.id ? "var(--win-field-bg)" : "transparent",
              color: "var(--win-text)",
            }}
          >
            {t.label}
          </div>
        ))}
      </div>
      <div style={{ flex: 1, overflowY: "auto" }}>
        {tab === "appearance" && <Appearance settings={settings} />}
        {tab === "sounds" && <Sounds settings={settings} />}
        {tab === "workspace" && <Workspace settings={settings} />}
        {tab === "keyboard" && <Keyboard />}
        {tab === "about" && <About />}
      </div>
    </div>
  );
}
