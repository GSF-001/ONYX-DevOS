import type { useSettings } from "./SettingsHooks";

export function Themes({ settings }: { settings: ReturnType<typeof useSettings> }) {
  return (
    <div style={{ padding: 16 }}>
      <p style={{ fontSize: 11, color: "var(--win-text-dim)", marginBottom: 10 }}>THEME</p>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
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
    </div>
  );
}
