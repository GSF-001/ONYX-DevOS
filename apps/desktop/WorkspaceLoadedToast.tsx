import { useEffect, useState } from "react";

interface WorkspaceLoadedToastProps {
  workspaceName: string | null;
  onDismiss: () => void;
}

/** The "Workspace Loaded: Monday Workspace" confirmation toast, separate
 * from the general notification stack since it's a one-off UI event tied
 * directly to LoadWorkspace, not a persisted notification. */
export function WorkspaceLoadedToast({ workspaceName, onDismiss }: WorkspaceLoadedToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!workspaceName) return;
    setVisible(true);
    const timeout = setTimeout(() => {
      setVisible(false);
      onDismiss();
    }, 3000);
    return () => clearTimeout(timeout);
  }, [workspaceName, onDismiss]);

  if (!visible || !workspaceName) return null;

  return (
    <div
      className="win-toast"
      style={{
        position: "fixed",
        bottom: 48,
        left: "50%",
        transform: "translateX(-50%)",
        borderLeft: "3px solid var(--win-accent)",
      }}
    >
      Workspace Loaded: <strong>{workspaceName}</strong>
    </div>
  );
}
