/**
 * ONYX DevOS
 * Copyright (c) 2026 GSF-001
 * All rights reserved.
 */

import { useEffect } from "react";
import { WindowManager, useWindowManager, WINDOW_REGISTRY } from "../window-manager";
import { Taskbar } from "../taskbar";
import { StatusBar } from "../taskbar/StatusBar";
import { CommandPalette } from "../command-palette";
import { NotificationManager, Popup, LiveNotification } from "../notifications";
import { ThemeProvider } from "../theme";
import { useSocketContext } from "../websocket/SocketContext";
import { TOKENS } from "../theme";
import { APP_ICONS } from "../icons";

export function DesktopPage() {
  return (
    <ThemeProvider>
      <NotificationManager>
        <div
          className="win-desktop"
          style={{ height: "100vh", width: "100vw" }}
        >
          <WindowManager>
            <AutoOpenDashboard />
            <DesktopIconGrid />
            <DesktopStatusBar />
            <Taskbar />
            <CommandPalette />
            <Popup />
            <LiveNotification />
          </WindowManager>
        </div>
      </NotificationManager>
    </ThemeProvider>
  );
}

/** Opens Dashboard maximized on first mount, matching the mockup where
 * the desktop boots straight into a full-window Dashboard.
 */
function AutoOpenDashboard() {
  const manager = useWindowManager();

  useEffect(() => {
    manager.open("dashboard");
    manager.maximize("dashboard");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

function DesktopStatusBar() {
  const { eventsProcessed } = useSocketContext();

  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: TOKENS.desktop.taskbarHeight,
        zIndex: TOKENS.zIndex.contextMenu - 100,
      }}
    >
      <StatusBar eventsProcessed={eventsProcessed} />
    </div>
  );
}

function DesktopIconGrid() {
  const manager = useWindowManager();

  return (
    <div
      style={{
        position: "absolute",
        top: 16,
        left: 16,
        right: 16,
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, 76px)",
        gridAutoRows: "90px",
        gap: 8,
      }}
    >
      {Object.values(WINDOW_REGISTRY).map((app) => {
        const Icon = APP_ICONS[app.id];

        return (
          <div
            key={app.id}
            className="win-icon"
            onClick={() => manager.open(app.id)}
          >
            <div
              style={{
                width: 32,
                height: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {Icon && <Icon />}
            </div>

            <span className="win-icon-label">
              {app.title}
            </span>
          </div>
        );
      })}
    </div>
  );
}
