import { WindowManager, useWindowManager, WINDOW_REGISTRY } from "../window-manager";
import { Taskbar } from "../taskbar";
import { CommandPalette } from "../command-palette";
import { NotificationManager, Popup, LiveNotification } from "../notifications";
import { ThemeProvider } from "../theme";

/**
 * Root desktop composition. Every piece here is real (window-manager,
 * taskbar, command-palette, notifications) — the one thing still missing
 * is a proper desktop/DesktopGrid + DesktopIcon layer with drag/rename/
 * context-menu. Until that's built, DesktopIconGrid below is a minimal
 * functional stand-in: double-click opens the app, nothing fancier.
 */
export function DesktopPage() {
  return (
    <ThemeProvider>
      <NotificationManager>
        <div className="win-desktop" style={{ height: "100vh", width: "100vw" }}>
          <DesktopIconGrid />
          <WindowManager />
          <Taskbar />
          <CommandPalette />
          <Popup />
          <LiveNotification />
        </div>
      </NotificationManager>
    </ThemeProvider>
  );
}

/**
 * Temporary stand-in for desktop/DesktopGrid + DesktopIcon (not built yet).
 * Renders every app in WINDOW_REGISTRY as a plain double-clickable icon.
 * Replace this component's internals once DesktopGrid/DesktopIcon/
 * ContextMenu exist — the double-click-to-open behavior underneath
 * (useWindowManager().open) will stay the same.
 */
function DesktopIconGrid() {
  const manager = useWindowManager();

  return (
    <div
      style={{
        position: "absolute",
        top: 16,
        left: 16,
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, 76px)",
        gap: 8,
      }}
    >
      {Object.values(WINDOW_REGISTRY).map((app) => (
        <div
          key={app.id}
          className="win-icon"
          onDoubleClick={() => manager.open(app.id)}
        >
          <div
            style={{
              width: 32,
              height: 32,
              background: "var(--win-face)",
              border: "1px solid var(--win-border)",
            }}
          />
          <span className="win-icon-label">{app.title}</span>
        </div>
      ))}
    </div>
  );
}
