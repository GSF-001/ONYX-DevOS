/**
 * ONYX DevOS
 * Copyright (c) 2026 GSF-001
 * All rights reserved.
 */

import { useState } from "react";
import type { useSettings } from "./SettingsHooks";

const ACCENT_COLORS = [
  "#000000", "#E5534B", "#FF8C00", "#D9A73E",
  "#3FB950", "#008080", "#3B82F6", "#8B5CF6",
  "#EC4899", "#808080",
];

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
              width: 96,
              padding: 8,
              border:
                theme.id === settings.themeId
                  ? "2px solid var(--win-accent)"
                  : "1px solid var(--win-face-dark)",
              background: theme.colors.windowFace,
              display: "flex",
              flexDirection: "column",
              gap: 6,
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: "100%",
                height: 24,
                background: theme.colors.titleBarActive,
                borderRadius: 2,
              }}
            />
            <span style={{ fontSize: 11, color: theme.colors.text }}>{theme.label}</span>
          </button>
        ))}
      </div>

      <p style={{ fontSize: 11, color: "var(--win-text-dim)", marginBottom: 10 }}>ACCENT COLOR</p>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {ACCENT_COLORS.map((color) => (
          <button
            key={color}
            onClick={() => chooseAccent(color)}
            aria-label={color}
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
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
