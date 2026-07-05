import type { WindowInstance } from "../window-manager/WindowContext";

interface RunningAppsProps {
  windows: WindowInstance[];
  focusedId: string | null;
  onSelect: (id: string, isFocused: boolean, isMinimized: boolean) => void;
}

export function RunningApps({ windows, focusedId, onSelect }: RunningAppsProps) {
  return (
    <div style={{ display: "flex", gap: 4, flex: 1, overflowX: "auto" }}>
      {windows.map((win) => {
        const isFocused = win.id === focusedId && !win.minimized;
        return (
          <button
            key={win.id}
            className="win-button"
            onClick={() => onSelect(win.id, isFocused, win.minimized)}
            style={{
              width: "auto",
              height: "100%",
              padding: "0 10px",
              fontSize: 12,
              background: isFocused ? "var(--win-titlebar-active)" : "var(--win-face)",
              color: isFocused ? "var(--win-titlebar-text)" : "var(--win-text)",
              maxWidth: 160,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {win.title}
          </button>
        );
      })}
    </div>
  );
}
