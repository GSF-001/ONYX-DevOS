/**
 * ONYX DevOS
 * Copyright (c) 2026 GSF-001
 * All rights reserved.
 */

// Community/Explore.tsx
/** "Explore" is a landing sub-view combining Trending + a Projects preview
 * — not a separate data source, just a different composition of what's
 * already fetched by Trending/Projects. */
import { Trending } from "./Trending";

export function Explore() {
  return <Trending />;
}
