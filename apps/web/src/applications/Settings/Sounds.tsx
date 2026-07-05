import type { useSettings } from "./SettingsHooks";
import { playClick, playSuccess, playError, playNotification } from "../../audio";

export function Sounds({ settings }: { settings: ReturnType<typeof useSettings> }) {
  return (
    <div style={{ padding: 16 }}>
      <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <input type="checkbox" checked={!settings.muted} onChange={settings.toggleMuted} />
        <span style={{ fontSize: 13 }}>Sound effects enabled</span>
      </label>

      <label style={{ display: "block", fontSize: 12, marginBottom: 6 }}>
        Volume
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={settings.volume}
          onChange={(e) => settings.updateVolume(Number(e.target.value))}
          disabled={settings.muted}
          style={{ width: "100%", marginTop: 4 }}
        />
      </label>

      <p style={{ fontSize: 11, color: "var(--win-text-dim)", marginTop: 12, marginBottom: 6 }}>TEST SOUNDS</p>
      <div style={{ display: "flex", gap: 6 }}>
        <button className="win-button" style={{ width: "auto", padding: "4px 10px" }} onClick={playClick}>
          Click
        </button>
        <button className="win-button" style={{ width: "auto", padding: "4px 10px" }} onClick={playSuccess}>
          Success
        </button>
        <button className="win-button" style={{ width: "auto", padding: "4px 10px" }} onClick={playError}>
          Error
        </button>
        <button className="win-button" style={{ width: "auto", padding: "4px 10px" }} onClick={playNotification}>
          Notification
        </button>
      </div>
    </div>
  );
}
