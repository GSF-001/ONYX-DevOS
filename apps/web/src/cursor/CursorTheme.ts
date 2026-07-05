/**
 * Maps semantic cursor names to CSS `cursor` values. Browsers don't allow
 * reading OS cursor themes, and we don't ship custom cursor image assets,
 * so this intentionally resolves to standard CSS cursor keywords — the
 * indirection exists so a future theme *could* swap in `url(...)` cursors
 * per-theme without touching call sites.
 */
export type CursorName =
  | "arrow"
  | "hand"
  | "text"
  | "move"
  | "resize-ew"
  | "resize-ns"
  | "resize-nwse"
  | "busy"
  | "loading"
  | "forbidden"
  | "crosshair";

const CURSOR_CSS: Record<CursorName, string> = {
  arrow: "default",
  hand: "pointer",
  text: "text",
  move: "move",
  "resize-ew": "ew-resize",
  "resize-ns": "ns-resize",
  "resize-nwse": "nwse-resize",
  busy: "wait",
  loading: "progress",
  forbidden: "not-allowed",
  crosshair: "crosshair",
};

export function cssForCursor(name: CursorName): string {
  return CURSOR_CSS[name];
}
