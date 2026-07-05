import type { ReactNode } from "react";
import { cn } from "../utils/classNames";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

/**
 * Standard "nothing here yet" placeholder. Copy should always say what the
 * screen needs and, where possible, offer the action that fills it — an
 * empty screen is an invitation to act, not a dead end.
 */
export function EmptyState({ title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn("empty-state", className)}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        padding: "48px 24px",
        textAlign: "center",
        color: "var(--color-text-dim)",
      }}
    >
      <div
        aria-hidden
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          border: "1px solid var(--color-border-bright)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 4,
          fontFamily: "var(--font-display)",
          color: "var(--color-text-faint)",
        }}
      >
        ·
      </div>
      <p style={{ color: "var(--color-text)", fontWeight: 600, fontSize: 15 }}>{title}</p>
      {description && <p style={{ fontSize: 13, maxWidth: 320 }}>{description}</p>}
      {action && <div style={{ marginTop: 8 }}>{action}</div>}
    </div>
  );
}
