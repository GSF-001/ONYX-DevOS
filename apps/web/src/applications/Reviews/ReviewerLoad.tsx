/**
 * ONYX DevOS
 * Copyright (c) 2026 GSF-001
 * All rights reserved.
 */

import { ReviewerLoadWidget } from "../../shared/components";
import type { ReviewerLoadEntry } from "./ReviewsTypes";

/** Thin app-local wrapper over the shared widget — kept as its own file
 * per your tree, but the actual rendering logic lives in shared/components
 * so Team's copy stays visually identical. */
export function ReviewerLoad({ entries }: { entries: ReviewerLoadEntry[] }) {
  return <ReviewerLoadWidget entries={entries} />;
}
