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

// DesktopContextMenu.tsx — right-click menu over the empty desktop area.
// Currently offers a single action: toggling the Clock & Calendar widget.

import { useEffect, useRef } from "react";

interface DesktopContextMenuProps {
  x: number;
  y: number;
  clockVisible: boolean;
  onToggleClock: () => void;
  onClose: () => void;
}

export function DesktopContextMenu({ x, y, clockVisible, onToggleClock, onClose }: DesktopContextMenuProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="context-menu"
      style={{ position: "fixed", left: x, top: y, zIndex: 9999 }}
    >
      <div
        className="context-menu-item"
        onClick={() => {
          onToggleClock();
          onClose();
        }}
      >
        {clockVisible ? "✓ " : "   "}Show Clock &amp; Calendar
      </div>
    </div>
  );
}
