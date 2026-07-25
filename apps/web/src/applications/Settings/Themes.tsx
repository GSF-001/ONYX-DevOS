/**
 * ONYX DevOS — Developer Operating System
 * © 2026 GSF-001
 *
 * Proprietary Software.
 * Unauthorized use is strictly prohibited.
 */

import { useState } from "react";
import type { useSettings } from "./SettingsHooks";

const ACCENT_COLORS = [
  "#000000", "#E5534B", "#FF8C00", "#D9A73E",
  "#3FB950", "#008080", "#3B82F6", "#8B5CF6",
  "#EC4899", "#808080",
];

function ThemeMockup({ colors }: { colors: { titleBarActive: string; windowFace: string; text: string } }) {
  return (
    <div
      style={{
        width: "100%",
        height: 64,
        background: colors.windowFace,
        border: "1px solid rgba(0,0,0,0.2)",
        borderRadius: 2,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ height: 10, background: colors.titleBarActive, flexShrink: 0 }} />
      <div style={{ flex: 1, display: "flex", padding: 4, gap: 3 }}>
        <div style={{ width: 12, height: "100%", background: colors.windowFace, border: `1px solid ${colors.text}22` }} />
        <div style={{ flex: 1, background: colors.windowFace, border: `1px solid ${colors.text}22` }} />
      </div>
    </div>
  );
}

export function Themes({ settings }: { settings: ReturnType<typeof useSettings> }) {
  const [accent, setAccent] = useState<string>(
    () => document.documentElement.style.getPropertyValue("--win-accent") || ACCENT_COLORS[2]
  );

  const chooseAccent = (color: string) => {
    document.documentElement.style.setProperty("--win-accent", color);
    setAccent(color);
  };

  return (
    <div style={{ padding: 16 }}>
      <p style={{ fontSize: 11, color: "var(--win-text-dim)", marginBottom: 10 }}>THEME</p>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
        {settings.themes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => settings.setThemeId(theme.id)}
            style={{
              width: 110,
              padding: 6,
              border:
                theme.id === settings.themeId
                  ? "2px solid var(--win-accent)"
                  : "1px solid var(--win-face-dark)",
              background: "var(--win-field-bg)",
              display: "flex",
              flexDirection: "column",
              gap: 6,
              alignItems: "center",
            }}
          >
            <ThemeMockup
              colors={{
                titleBarActive: theme.colors.titleBarActive,
                windowFace: theme.colors.windowFace,
                text: theme.colors.text,
              }}
            />
            <span style={{ fontSize: 11, color: "var(--win-text)" }}>{theme.label}</span>
          </button>
        ))}
      </div>

      <p style={{ fontSize: 11, color: "var(--win-text-dim)", marginBottom: 10 }}>ACCENT COLOR</p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {ACCENT_COLORS.map((color) => (
          <button
            key={color}
            onClick={() => chooseAccent(color)}
            aria-label={color}
            style={{
              width: 28,
              height: 28,
              borderRadius: 2,
              background: color,
              border:
                color === accent
                  ? "2px solid var(--win-text)"
                  : "1px solid var(--win-face-dark)",
              cursor: "default",
            }}
          />
        ))}
      </div>
    </div>
  );
}
