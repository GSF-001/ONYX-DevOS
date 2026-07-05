import { getWorkspace } from "./WorkspaceManager";
import { openSingletonWindow } from "../window-manager/Open";
import type { WindowAction } from "../window-manager/WindowContext";

/**
 * Restores a named workspace by re-opening each of its saved windows.
 * Returns the workspace name if found (so callers can show a toast),
 * or null if no workspace with that name exists.
 */
export function loadWorkspace(name: string, dispatch: React.Dispatch<WindowAction>): string | null {
  const workspace = getWorkspace(name);
  if (!workspace) return null;

  for (const win of workspace.windows) {
    openSingletonWindow(dispatch, win.appId, win.title);
  }

  return workspace.name;
}
