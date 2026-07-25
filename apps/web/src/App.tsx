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

import { Outlet } from "react-router-dom";
import { ErrorBoundary } from "./shared/components";
import { ThemeProvider } from "./theme";

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Outlet />
      </ThemeProvider>
    </ErrorBoundary>
  );
}
