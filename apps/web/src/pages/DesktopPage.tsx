/**
 * ONYX DevOS — Developer Operating System
 * © 2026 GSF-001
 *
 * Proprietary Software.
 * Unauthorized use is strictly prohibited.
 */

/**
 * ONYX DevOS
 * Copyright (c) 2026 GSF-001
 * All rights reserved.
 */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { WindowManager, useWindowManager, WINDOW_REGISTRY } from "../window-manager";
import { Taskbar } from "../taskbar";
import { StatusBar } from "../taskbar/StatusBar";
import { CommandPalette } from "../command-palette";
import { NotificationManager, Popup, LiveNotification } from "../notifications";
import { ThemeProvider } from "../theme";
import { useSocketContext } from "../websocket/SocketContext";
import { TOKENS } from "../theme";
import { APP_ICONS } from "../icons";

const MENU_ITEMS = ["File", "View", "Repository", "Tools", "Window", "Help"];

export function DesktopPage() {
  return (
    <ThemeProvider>
      <NotificationManager>
        <div
          className="win-desktop"
          style={{ height: "100vh", width: "100vw", display: "flex", flexDirection: "column" }}
        >
          <TitleBar />
          <MenuBar />
          <RepoInfoBar />

          <WindowManager>
            <div style={{ position: "relative", flex: 1, overflow: "hidden" }}>
              <div
                className="no-scrollbar"
                style={{
                  position: "absolute",
                  inset: 0,
                  right: 244,
                  overflowY: "auto",
                  padding: 24,
                }}
              >
                <DesktopIconGrid />
              </div>
              <div className="no-scrollbar" style={{ position: "absolute", top: 24, right: 24, bottom: 24, width: 220, overflowY: "auto" }}>
                <SystemPanel />
              </div>
            </div>
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

function TitleBar() {
  const navigate = useNavigate();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleMinimize = () => {
    document.body.style.transition = "opacity 0.15s ease";
    document.body.style.opacity = "0.35";
    window.setTimeout(() => {
      document.body.style.opacity = "1";
    }, 150);
  };

  const handleMaximizeToggle = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleClose = () => {
    navigate("/");
  };

  return (
    <div className="win-titlebar" style={{ flexShrink: 0 }}>
      <span>ONYX WORKSTATION v1.0.0 — CONNECTED TO: GSF-001/ONYX-DevOS</span>
    </div>
  );
}

function MenuBar() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 18,
        height: 24,
        padding: "0 10px",
        fontSize: 12,
        background: "var(--win-face)",
        borderBottom: "1px solid var(--win-face-dark)",
        flexShrink: 0,
      }}
    >
      {MENU_ITEMS.map((item) => (
        <span key={item} style={{ color: "var(--win-text)" }}>
          {item}
        </span>
      ))}
    </div>
  );
}

function RepoInfoBar() {
  const { status } = useSocketContext();
  const isLive = status === "connected";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        height: 28,
        padding: "0 12px",
        fontSize: 11,
        fontFamily: "var(--win-font-mono)",
        background: "var(--win-face)",
        borderBottom: "1px solid var(--win-face-dark)",
        color: "var(--win-text-dim)",
        flexShrink: 0,
      }}
    >
      <span>
        REPOSITORY: <strong style={{ color: "var(--win-text)" }}>GSF-001/ONYX-DevOS</strong>
      </span>
      <span>LAST SYNC: 00:13:42 AGO</span>
      <span>DATA RANGE: MAY 12 - MAY 19, 2024</span>
      <div style={{ flex: 1 }} />
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          color: isLive ? "var(--win-success)" : "var(--win-text-dim)",
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            background: isLive ? "var(--win-success)" : "var(--win-text-dim)",
          }}
        />
        LIVE
      </span>
    </div>
  );
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

const ICON_ORDER = [
  "dashboard", "insights", "pullRequests", "reviews", "issues",
  "team", "reports", "repository", "heatmap", "gitGraph", "terminal",
];

const ICON_CELL = 92;
const ICON_ROW = 100;
const ICON_GAP = 16;

function IconTile({
  appId,
  selected,
  onSelect,
  onOpen,
}: {
  appId: string;
  selected: boolean;
  onSelect: () => void;
  onOpen: () => void;
}) {
  const app = WINDOW_REGISTRY[appId];
  if (!app) return null;
  const Icon = APP_ICONS[appId];

  return (
    <div
      className={`win-icon${selected ? " selected" : ""}`}
      onClick={onOpen}
    >
      <div
        style={{
          width: 40,
          height: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {Icon && <Icon />}
      </div>
      <span className="win-icon-label">{app.title.toUpperCase()}</span>
    </div>
  );
}

function DesktopIconGrid() {
  const manager = useWindowManager();
  const [selected, setSelected] = useState<string | null>("dashboard");

  const apps = ICON_ORDER.filter((id) => WINDOW_REGISTRY[id]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: ICON_GAP }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(auto-fill, ${ICON_CELL}px)`,
          gridAutoRows: ICON_ROW,
          gap: ICON_GAP,
        }}
      >
        {apps.map((id) => (
          <IconTile
            key={id}
            appId={id}
            selected={selected === id}
            onSelect={() => setSelected(id)}
            onOpen={() => manager.open(id)}
          />
        ))}
      </div>

      {WINDOW_REGISTRY.settings && (
        <>
          <div style={{ borderTop: "1px solid var(--win-face-dark)" }} />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(auto-fill, ${ICON_CELL}px)`,
              gridAutoRows: ICON_ROW,
              gap: ICON_GAP,
            }}
          >
            <IconTile
              appId="settings"
              selected={selected === "settings"}
              onSelect={() => setSelected("settings")}
              onOpen={() => manager.open("settings")}
            />
          </div>
        </>
      )}
    </div>
  );
}

function SystemPanel() {
  return <ClockCalendar />;
}

function ClockCalendar() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const timeStr = now.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const dateStr = now.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const year = now.getFullYear();
  const month = now.getMonth();
  const today = now.getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthLabel = now.toLocaleDateString(undefined, { month: "long", year: "numeric" });

  const cells: (number | null)[] = [
    ...Array(firstDayOfWeek).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="win-frame" style={{ padding: 12 }}>
      <p
        style={{
          margin: 0,
          fontFamily: "var(--win-font-mono)",
          fontSize: 26,
          fontWeight: 700,
          color: "var(--win-text)",
          textAlign: "center",
        }}
      >
        {timeStr}
      </p>
      <p
        style={{
          margin: "2px 0 10px",
          fontSize: 11,
          color: "var(--win-text-dim)",
          textAlign: "center",
        }}
      >
        {dateStr}
      </p>

      <p
        style={{
          margin: "0 0 6px",
          fontSize: 11,
          fontWeight: 700,
          color: "var(--win-text)",
          borderTop: "1px solid var(--win-face-dark)",
          paddingTop: 8,
          textAlign: "center",
        }}
      >
        {monthLabel}
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 2,
          fontSize: 10,
          color: "var(--win-text-dim)",
          textAlign: "center",
        }}
      >
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <span key={i}>{d}</span>
        ))}
        {cells.map((day, i) => (
          <span
            key={i}
            style={{
              padding: "2px 0",
              color: day === today ? "var(--win-titlebar-text)" : "var(--win-text-dim)",
              background: day === today ? "var(--win-titlebar-active)" : "transparent",
              fontWeight: day === today ? 700 : 400,
            }}
          >
            {day ?? ""}
          </span>
        ))}
      </div>
    </div>
  );
}
