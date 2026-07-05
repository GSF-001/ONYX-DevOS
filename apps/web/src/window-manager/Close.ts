import type { WindowAction } from "./WindowContext";

export function closeWindow(dispatch: React.Dispatch<WindowAction>, id: string): void {
  dispatch({ type: "CLOSE", id });
}
