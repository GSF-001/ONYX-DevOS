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

/**
 * Terminal has no REST calls of its own — every command it runs goes
 * through the window manager (open/close app) or router (navigate), both
 * already real, local operations. This file exists for convention
 * consistency with other apps' *API.ts files, not because a server call
 * was needed.
 */
export const TerminalAPI = {};
