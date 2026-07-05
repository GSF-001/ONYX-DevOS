import { TOKENS } from "../theme";

interface ConfirmProps {
  title: string;
  message: string;
  confirmLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/** Blocking confirm dialog — used for destructive actions like
 * disconnecting a repository or removing a team member. */
export function Confirm({ title, message, confirmLabel = "Confirm", danger, onConfirm, onCancel }: ConfirmProps) {
  return (
    <div
      role="alertdialog"
      aria-modal
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: TOKENS.zIndex.toast + 100,
      }}
    >
      <div className="win-frame" style={{ width: 340, padding: 16 }}>
        <p style={{ fontWeight: 700, marginBottom: 8 }}>{title}</p>
        <p style={{ fontSize: 13, color: "var(--win-text-dim)", marginBottom: 16 }}>{message}</p>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button onClick={onCancel}>Cancel</button>
          <button
            onClick={onConfirm}
            style={{ background: danger ? "var(--win-danger)" : "var(--win-accent)", color: "#fff" }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
