import { TOKENS } from "../theme";

interface AlertProps {
  title: string;
  message: string;
  onDismiss: () => void;
}

/** Blocking modal alert — for things the person must acknowledge, unlike
 * the passive auto-dismissing Toast stack. */
export function Alert({ title, message, onDismiss }: AlertProps) {
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
      <div className="win-frame" style={{ width: 320, padding: 16 }}>
        <p style={{ fontWeight: 700, marginBottom: 8 }}>{title}</p>
        <p style={{ fontSize: 13, color: "var(--win-text-dim)", marginBottom: 16 }}>{message}</p>
        <button onClick={onDismiss} style={{ float: "right" }}>
          OK
        </button>
      </div>
    </div>
  );
}
