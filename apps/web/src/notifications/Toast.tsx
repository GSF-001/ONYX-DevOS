import type { ReactNode } from "react";
import type { NotificationTone } from "./NotificationManager";

interface ToastProps {
  tone: NotificationTone;
  title: string;
  body?: ReactNode;
  onDismiss: () => void;
}

const TONE_ACCENT: Record<NotificationTone, string> = {
  info: "var(--win-accent, #4fd1ae)",
  success: "var(--win-success, #3FB950)",
  warning: "var(--win-warning, #D9A73E)",
  error: "var(--win-danger, #E5534B)",
};

export function Toast({ tone, title, body, onDismiss }: ToastProps) {
  return (
    <div
      className="win-toast"
      style={{
        borderLeft: `3px solid ${TONE_ACCENT[tone]}`,
        display: "flex",
        justifyContent: "space-between",
        gap: 10,
        minWidth: 260,
        maxWidth: 340,
      }}
    >
      <div>
        <p style={{ fontWeight: 700, marginBottom: body ? 4 : 0 }}>{title}</p>
        {body && <div style={{ color: "var(--win-text-dim, #888)" }}>{body}</div>}
      </div>
      <button
        onClick={onDismiss}
        aria-label="Dismiss"
        style={{ background: "none", border: "none", color: "inherit", fontSize: 14 }}
      >
        ×
      </button>
    </div>
  );
}
