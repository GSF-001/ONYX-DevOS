import { useState, useRef, useEffect, type ReactNode } from "react";

export interface MenuBarAction {
  label: string;
  onSelect: () => void;
  disabled?: boolean;
  divider?: boolean;
}

interface MenuBarItemProps {
  label: string;
  actions: MenuBarAction[];
}

export function MenuBarItem({ label, actions }: MenuBarItemProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <div className={`win-menubar-item${open ? " open" : ""}`} onClick={() => setOpen((o) => !o)}>
        {label}
      </div>
      {open && (
        <div className="context-menu" style={{ position: "absolute", top: "100%", left: 0, zIndex: 10 }}>
          {actions.map((action, i): ReactNode =>
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
                  setOpen(false);
                }}
              >
                {action.label}
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
