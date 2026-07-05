import type { WindowAction } from "./WindowContext";

export function focusWindow(dispatch: React.Dispatch<WindowAction>, id: string): void {
  dispatch({ type: "FOCUS", id });
}
