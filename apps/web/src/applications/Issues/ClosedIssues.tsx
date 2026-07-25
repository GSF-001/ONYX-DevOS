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

// Issues/ClosedIssues.tsx
import { EmptyState } from "../../shared/components";

export function ClosedIssues() {
  return (
    <EmptyState
      title="Closed issues list isn't exposed yet"
      description="Needs GET /repositories/:id/issues?state=closed on the backend."
    />
  );
}
