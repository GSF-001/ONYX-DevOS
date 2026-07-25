/**
 * ONYX DevOS — Developer Operating System
 * © 2026 GSF-001
 *
 * Proprietary Software.
 * Unauthorized use is strictly prohibited.
 */

/**
 * ONYX DevOS
 * Copyright (c) 2026 GSF-001
 * All rights reserved.
 */

import type { WindowAction } from "./WindowContext";

export function maximizeWindow(dispatch: React.Dispatch<WindowAction>, id: string): void {
  dispatch({ type: "MAXIMIZE", id });
}
