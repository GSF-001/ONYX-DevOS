/**
 * ONYX DevOS
 * Copyright (c) 2026 GSF-001
 * All rights reserved.
 */

import type { WindowAction } from "./WindowContext";

export function minimizeWindow(dispatch: React.Dispatch<WindowAction>, id: string): void {
  dispatch({ type: "MINIMIZE", id });
}
