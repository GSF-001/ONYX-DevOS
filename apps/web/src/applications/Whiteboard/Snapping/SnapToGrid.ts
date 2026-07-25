// Snapping/SnapToGrid.ts

import { Point } from "../WhiteboardTypes";
import { GRID_SNAP_THRESHOLD_PX, isWithinThreshold } from "./SnapThreshold";

export function snapValueToGrid(value: number, gridSize: number): number {
  if (gridSize <= 0) return value;
  return Math.round(value / gridSize) * gridSize;
}

export function snapPointToGrid(point: Point, gridSize: number): Point {
  return {
    x: snapValueToGrid(point.x, gridSize),
    y: snapValueToGrid(point.y, gridSize),
  };
}

/**
 * Only snaps if the point is already close to a grid line (soft snapping),
 * otherwise returns the original point unchanged.
 */
export function softSnapToGrid(
  point: Point,
  gridSize: number,
  zoom: number,
  threshold: number = GRID_SNAP_THRESHOLD_PX
): Point {
  const snapped = snapPointToGrid(point, gridSize);
  return {
    x: isWithinThreshold(point.x, snapped.x, zoom, threshold) ? snapped.x : point.x,
    y: isWithinThreshold(point.y, snapped.y, zoom, threshold) ? snapped.y : point.y,
  };
}

export function getGridLinesInView(
  viewBounds: { x: number; y: number; width: number; height: number },
  gridSize: number
): { verticals: number[]; horizontals: number[] } {
  const verticals: number[] = [];
  const horizontals: number[] = [];
  const startX = Math.floor(viewBounds.x / gridSize) * gridSize;
  const startY = Math.floor(viewBounds.y / gridSize) * gridSize;

  for (let x = startX; x <= viewBounds.x + viewBounds.width; x += gridSize) {
    verticals.push(x);
  }
  for (let y = startY; y <= viewBounds.y + viewBounds.height; y += gridSize) {
    horizontals.push(y);
  }
  return { verticals, horizontals };
}
