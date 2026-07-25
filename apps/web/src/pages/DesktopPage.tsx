/**
 * ONYX DevOS — Developer Operating System
 * © 2026 GSF-001
 *
 * Proprietary Software.
 * Unauthorized use is strictly prohibited.
 */

import { useEffect, useRef, useState } from "react";
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
import { SettingsProvider } from "../applications/Settings/core/SettingsProvider";

const MENU_ITEMS = ["File", "View", "Repository", "Tools", "Window", "Help"];

export function DesktopPage() {
  const [showClock, setShowClock] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    return localStorage.getItem("onyx.showClockWidget") !== "false";
  });
  const toggleClockWidget = () => {
    setShowClock((prev) => {
      const next = !prev;
      localStorage.setItem("onyx.showClockWidget", String(next));
      return next;
    });
  };

  return (
    <ThemeProvider>
      <SettingsProvider>
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
                  right: showClock ? 244 : 24,
                  overflowY: "auto",
                  padding: 24,
                }}
              >
                <DesktopIconGrid />
              </div>
              {showClock && (
                <div className="no-scrollbar" style={{ position: "absolute", top: 24, right: 24, bottom: 24, width: 220, overflowY: "auto" }}>
                  <SystemPanel />
                </div>
              )}
              <button
                onClick={toggleClockWidget}
                className="win-button"
                title={showClock ? "Hide clock & calendar" : "Show clock & calendar"}
                style={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  width: 26,
                  height: 26,
                  fontSize: 13,
                  zIndex: 10,
                }}
              >
                {showClock ? "🗕" : "🕐"}
              </button>
            </div>
            <DesktopStatusBar />
            <Taskbar />
            <CommandPalette />
            <Popup />
            <LiveNotification />
          </WindowManager>
        </div>
      </NotificationManager>
      </SettingsProvider>
    </ThemeProvider>
  );
}

const TITLEBAR_TEXT = "ONYX WORKSTATION v1.0.0 — CONNECTED TO: GSF-001/ONYX-DevOS";
const TYPEWRITER_SPEED_MS = 35;

function useTypewriter(text: string, speed: number) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(0);
    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setCount(i);
      if (i >= text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return text.slice(0, count);
}

function TitleBar() {
  const navigate = useNavigate();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const typed = useTypewriter(TITLEBAR_TEXT, TYPEWRITER_SPEED_MS);
  const done = typed.length >= TITLEBAR_TEXT.length;

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
      <span>{typed}</span>
    </div>
  );
}

function MenuBar() {
  return (
    <div
      className="win-menubar"
      style={{
        gap: 2,
        height: 24,
        padding: "0 6px",
        fontSize: 12,
        borderTop: "1px solid var(--win-face-light)",
        borderBottom: "1px solid var(--win-face-dark)",
        boxShadow: "0 1px 0 var(--win-face-dark) inset",
        flexShrink: 0,
      }}
    >
      {MENU_ITEMS.map((item) => (
        <span key={item} className="win-menubar-item" style={{ color: "var(--win-text)" }}>
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
      <span className="win-infobar-divider" />
      <span>LAST SYNC: 00:13:42 AGO</span>
      <span className="win-infobar-divider" />
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

const DEFAULT_ICON_ORDER = [
  "dashboard", "insights", "pullRequests", "reviews", "issues",
  "team", "reports", "repository", "heatmap", "gitGraph", "workflow", "whiteboard", "terminal",
];
const ICON_ORDER_STORAGE_KEY = "onyx.iconOrder";

function loadIconOrder(): string[] {
  try {
    const raw = localStorage.getItem(ICON_ORDER_STORAGE_KEY);
    if (!raw) return DEFAULT_ICON_ORDER;
    const saved: string[] = JSON.parse(raw);
    const missing = DEFAULT_ICON_ORDER.filter((id) => !saved.includes(id));
    return [...saved.filter((id) => WINDOW_REGISTRY[id]), ...missing];
  } catch {
    return DEFAULT_ICON_ORDER;
  }
}

function saveIconOrder(order: string[]) {
  try {
    localStorage.setItem(ICON_ORDER_STORAGE_KEY, JSON.stringify(order));
  } catch {}
}

const ICON_CELL = 92;
const ICON_ROW = 100;
const ICON_GAP = 16;

function IconTile({
  appId,
  selected,
  running,
  focused,
  dragging,
  translate,
  tileRef,
  onPointerDown,
  onPointerMove,
  onPointerUp,
}: {
  appId: string;
  selected: boolean;
  running: boolean;
  focused: boolean;
  dragging: boolean;
  translate: { x: number; y: number } | null;
  tileRef: (el: HTMLDivElement | null) => void;
  onPointerDown: (id: string, e: React.PointerEvent) => void;
  onPointerMove: (id: string, e: React.PointerEvent) => void;
  onPointerUp: (id: string, e: React.PointerEvent) => void;
}) {
  const app = WINDOW_REGISTRY[appId];
  if (!app) return null;
  const Icon = APP_ICONS[appId];
  const [hovered, setHovered] = useState(false);

  return (
    <div
      ref={tileRef}
      className={`win-icon${selected ? " selected" : ""}`}
      onPointerDown={(e) => onPointerDown(appId, e)}
      onPointerMove={(e) => onPointerMove(appId, e)}
      onPointerUp={(e) => onPointerUp(appId, e)}
      onPointerCancel={(e) => onPointerUp(appId, e)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        touchAction: "none",
        userSelect: "none",
        position: "relative",
        zIndex: dragging ? 20 : 1,
        opacity: dragging ? 0.6 : 1,
        transform: translate
          ? `translate(${translate.x}px, ${translate.y}px)`
          : hovered
          ? "translateY(-1px)"
          : undefined,
        cursor: dragging ? "grabbing" : "default",
        borderRadius: 4,
        background: selected
          ? "var(--win-titlebar-active)"
          : hovered
          ? "color-mix(in srgb, var(--win-text) 10%, transparent)"
          : "transparent",
        outline: focused ? "1px solid var(--win-titlebar-active)" : "1px solid transparent",
        transition: dragging ? "none" : "transform 120ms ease, background 120ms ease, outline-color 120ms ease",
      }}
    >
      <div
        className="win-icon-glyph"
        style={{
          width: 40,
          height: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {Icon && <Icon />}
        {running && (
          <span
            style={{
              position: "absolute",
              bottom: -2,
              width: 4,
              height: 4,
              borderRadius: "50%",
              background: "var(--win-success)",
            }}
          />
        )}
      </div>
      <span className="win-icon-label">{app.title.toUpperCase()}</span>
    </div>
  );
}

const DRAG_THRESHOLD_PX = 10;

function DesktopIconGrid() {
  const manager = useWindowManager();
  const [selected, setSelected] = useState<string | null>(null);
  const [order, setOrder] = useState<string[]>(() => loadIconOrder());
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOrigin, setDragOrigin] = useState<{ x: number; y: number } | null>(null);
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);

  const tileRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const dragState = useRef<{ id: string; startX: number; startY: number; moved: boolean } | null>(null);

  const apps = order.filter((id) => WINDOW_REGISTRY[id]);

  const runningAppIds = new Set(manager.windows.filter((w) => !w.minimized).map((w) => w.appId));
  const focusedApp = manager.windows.find((w) => w.id === manager.focusedId)?.appId ?? null;

  const reorder = (fromId: string, toId: string) => {
    setOrder((prev) => {
      const from = prev.indexOf(fromId);
      const to = prev.indexOf(toId);
      if (from === -1 || to === -1 || from === to) return prev;
      const next = [...prev];
      next.splice(from, 1);
      next.splice(to, 0, fromId);
      saveIconOrder(next);
      return next;
    });
  };

  const handlePointerDown = (id: string, e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragState.current = { id, startX: e.clientX, startY: e.clientY, moved: false };
  };

  const handlePointerMove = (id: string, e: React.PointerEvent) => {
    const drag = dragState.current;
    if (!drag || drag.id !== id) return;

    const dx = e.clientX - drag.startX;
    const dy = e.clientY - drag.startY;

    if (!drag.moved && Math.hypot(dx, dy) > DRAG_THRESHOLD_PX) {
      drag.moved = true;
      setDraggingId(id);
      setDragOrigin({ x: drag.startX, y: drag.startY });
    }

    if (drag.moved) {
      setDragPos({ x: e.clientX, y: e.clientY });

      for (const otherId of apps) {
        if (otherId === id) continue;
        const el = tileRefs.current[otherId];
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) {
          reorder(id, otherId);
          break;
        }
      }
    }
  };

  const handlePointerUp = (id: string, e: React.PointerEvent) => {
    const drag = dragState.current;
    if (drag && drag.id === id && !drag.moved) {
      setSelected(id);
      manager.open(id);
      window.setTimeout(() => {
        setSelected((current) => (current === id ? null : current));
      }, 220);
    }
    dragState.current = null;
    setDraggingId(null);
    setDragOrigin(null);
    setDragPos(null);
  };

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
        {apps.map((id) => {
          const isDragging = draggingId === id;
          const translate =
            isDragging && dragOrigin && dragPos
              ? { x: dragPos.x - dragOrigin.x, y: dragPos.y - dragOrigin.y }
              : null;
          return (
            <IconTile
              key={id}
              appId={id}
              selected={selected === id}
              running={runningAppIds.has(id)}
              focused={focusedApp === id}
              dragging={isDragging}
              translate={translate}
              tileRef={(el) => {
                tileRefs.current[id] = el;
              }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
            />
          );
        })}
      </div>
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
