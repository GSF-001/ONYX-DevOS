import type { WindowAction } from "./WindowContext";

export function restoreWindow(dispatch: React.Dispatch<WindowAction>, id: string): void {
  dispatch({ type: "RESTORE", id });
}
