/**
 * ONYX DevOS
 * Copyright (c) 2026 GSF-001
 * All rights reserved.
 */

export function GitGraphIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" shapeRendering="crispEdges" aria-hidden>
      <rect x="0" y="0" width="32" height="32" fill="none" />
      <line x1="10" y1="7" x2="10" y2="25" stroke="#000" strokeWidth="1.5" />
      <line x1="22" y1="16" x2="22" y2="25" stroke="#000" strokeWidth="1.5" />
      <path d="M10 16 C10 12, 14 12, 22 12" stroke="#000" strokeWidth="1.5" fill="none" />
      <circle cx="10" cy="7" r="3" fill="#DFDFDF" stroke="#000" />
      <circle cx="10" cy="16" r="3" fill="#C0C0C0" stroke="#000" />
      <circle cx="10" cy="25" r="3" fill="#DFDFDF" stroke="#000" />
      <circle cx="22" cy="12" r="3" fill="#000080" stroke="#000" />
      <circle cx="22" cy="25" r="3" fill="#DFDFDF" stroke="#000" />
    </svg>
  );
}
