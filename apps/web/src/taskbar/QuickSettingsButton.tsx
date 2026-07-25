/**
 * ONYX DevOS — Developer Operating System
 * © 2026 GSF-001
 *
 * Proprietary Software.
 * Unauthorized use is strictly prohibited.
 */

/**
 * ONYX DevOS — Developer Operating System
 * © 2026 GSF-001
 *
 * Proprietary Software.
 * Unauthorized use is strictly prohibited.
 */

// QuickSettingsButton.tsx — hamburger button in the taskbar that opens a
// small popup with a shortcut into the Settings app.

import { useEffect, useRef, useState } from "react";

interface QuickSettingsButtonProps {
  onOpenApp: (appId: string) => void;
}

export function QuickSettingsButton({ onOpenApp }: QuickSettingsButtonProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={ref} style={{ position: "relative", height: "100%" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="win-button"
        title="Quick settings"
        style={{
          height: "100%",
          width: 32,
          fontSize: 14,
          background: open ? "var(--win-titlebar-active)" : "var(--win-face)",
          color: open ? "var(--win-titlebar-text)" : "var(--win-text)",
        }}
      >
        ☰
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            bottom: "100%",
            width: 180,
            background: "#c0c0c0",
            borderTop: "2px solid #fff",
            borderLeft: "2px solid #fff",
            borderRight: "2px solid #444",
            borderBottom: "2px solid #444",
            boxShadow: "4px 4px 8px rgba(0,0,0,.45)",
            overflow: "hidden",
          }}
        >
          <div
            style={{ padding: "10px 14px", cursor: "pointer", fontSize: 13, color: "#000" }}
            onClick={() => {
              onOpenApp("settings");
              setOpen(false);
            }}
          >
            ⚙ Settings
          </div>
        </div>
      )}
    </div>
  );
}
