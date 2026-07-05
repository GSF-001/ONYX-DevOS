export type SnapZone = "left-half" | "right-half" | "top-half" | "maximize" | null;

const EDGE_THRESHOLD = 24;

/** Determines which snap zone a drag position falls into, based on
 * distance from the screen edges (Win11-style edge snapping). */
export function detectSnapZone(clientX: number, clientY: number): SnapZone {
  const { innerWidth, innerHeight } = window;

  if (clientY <= EDGE_THRESHOLD) return "maximize";
  if (clientX <= EDGE_THRESHOLD) return "left-half";
  if (clientX >= innerWidth - EDGE_THRESHOLD) return "right-half";
  if (clientY >= innerHeight - EDGE_THRESHOLD) return "top-half";
  return null;
}

export function boundsForSnapZone(zone: SnapZone, taskbarHeight: number) {
  const { innerWidth, innerHeight } = window;
  const usableHeight = innerHeight - taskbarHeight;

  switch (zone) {
    case "left-half":
      return { x: 0, y: 0, width: innerWidth / 2, height: usableHeight };
    case "right-half":
      return { x: innerWidth / 2, y: 0, width: innerWidth / 2, height: usableHeight };
    case "top-half":
    case "maximize":
      return { x: 0, y: 0, width: innerWidth, height: usableHeight };
    default:
      return null;
  }
}
