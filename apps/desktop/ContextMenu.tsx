import { useEffect, useRef } from "react";
import { TOKENS } from "../theme";

export interface ContextMenuAction {
  label: string;
  onSelect: () => void;
  divider?: boolean;
  disabled?: boolean;
}

interface ContextMenuProps {
  x: number;
  y: number;
  actions: ContextMenuAction[];
  onClose: () => void;
}

export function ContextMenu({ x, y, actions, onClose }: ContextMenuProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    window.addEventListener("mousedown", handler);
    window.addEventListener("scroll", onClose);
    return () => {
      window.removeEventListener("mousedown", handler);
      window.removeEventListener("scroll", onClose);
    };
  }, [onClose]);

  // Clamp so the menu never renders off-screen.
  const clampedX = Math.min(x, window.innerWidth - 200);
  const clampedY = Math.min(y, window.innerHeight - actions.length * 26 - 40);

  return (
    <div
      ref={ref}
      className="context-menu"
      style={{ position: "fixed", left: clampedX, top: clampedY, zIndex: TOKENS.zIndex.contextMenu }}
    >
      {actions.map((action, i) =>
        action.divider ? (
          <div key={`div-${i}`} className="context-menu-divider" />
        ) : (
          <div
            key={action.label}
            className="context-menu-item"
            style={{ opacity: action.disabled ? 0.5 : 1 }}
            onClick={() => {
              if (action.disabled) return;
              action.onSelect();
              onClose();
            }}
          >
            {action.label}
          </div>
        )
      )}
    </div>
  );
}
