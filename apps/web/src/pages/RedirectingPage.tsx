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

import { LoadingSpinner } from "../shared/components";

/**
 * Rendered for the split second between clicking "Connect GitHub" and the
 * loader's window.location.href kicking in. Exists purely so there's no
 * blank white flash during that redirect.
 */
export function RedirectingPage() {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <LoadingSpinner label="Redirecting to GitHub..." />
    </div>
  );
}
