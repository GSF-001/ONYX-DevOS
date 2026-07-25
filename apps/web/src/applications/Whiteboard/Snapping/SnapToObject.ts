/**
 * ONYX DevOS — Developer Operating System
 * © 2026 GSF-001
 *
 * Proprietary Software.
 * Unauthorized use is strictly prohibited.
 */

// Snapping/SnapToObject.ts
// Edge/center alignment snapping: compares the moving rect's left/center/right
// and top/middle/bottom edges against every other object's matching edges.

import { Rect, WhiteboardObject } from "../WhiteboardTypes";
import { OBJECT_SNAP_THRESHOLD_PX, isWithinThreshold } from "./SnapThreshold";

export interface ObjectSnapResult {
  x: number | null;
  y: number | null;
  matchedXTarget?: number;
  matchedYTarget?: number;
}

function edgesX(rect: Rect) {
  return { left: rect.x, centerX: rect.x + rect.width / 2, right: rect.x + rect.width };
}

function edgesY(rect: Rect) {
  return { top: rect.y, centerY: rect.y + rect.height / 2, bottom: rect.y + rect.height };
}

export function snapRectToObjects(
  moving: Rect,
  others: WhiteboardObject[],
  zoom: number,
  threshold: number = OBJECT_SNAP_THRESHOLD_PX
): ObjectSnapResult {
  const movingX = edgesX(moving);
  const movingY = edgesY(moving);

  let bestX: { delta: number; snappedLeft: number; target: number } | null = null;
  let bestY: { delta: number; snappedTop: number; target: number } | null = null;

  for (const other of others) {
    const ox = edgesX(other);
    const oy = edgesY(other);

    const xCandidates: [number, number][] = [
      [movingX.left, 0],
      [movingX.centerX, moving.width / 2],
      [movingX.right, moving.width],
    ];
    for (const [edge, offset] of xCandidates) {
      for (const target of [ox.left, ox.centerX, ox.right]) {
        if (isWithinThreshold(edge, target, zoom, threshold)) {
          const delta = Math.abs(edge - target);
          if (!bestX || delta < bestX.delta) {
            bestX = { delta, snappedLeft: target - offset, target };
          }
        }
      }
    }

    const yCandidates: [number, number][] = [
      [movingY.top, 0],
      [movingY.centerY, moving.height / 2],
      [movingY.bottom, moving.height],
    ];
    for (const [edge, offset] of yCandidates) {
      for (const target of [oy.top, oy.centerY, oy.bottom]) {
        if (isWithinThreshold(edge, target, zoom, threshold)) {
          const delta = Math.abs(edge - target);
          if (!bestY || delta < bestY.delta) {
            bestY = { delta, snappedTop: target - offset, target };
          }
        }
      }
    }
  }

  return {
    x: bestX ? bestX.snappedLeft : null,
    y: bestY ? bestY.snappedTop : null,
    matchedXTarget: bestX?.target,
    matchedYTarget: bestY?.target,
  };
}

export function snapPointToObjects(
  point: { x: number; y: number },
  others: WhiteboardObject[],
  zoom: number,
  threshold: number = OBJECT_SNAP_THRESHOLD_PX
): { x: number | null; y: number | null } {
  let bestX: number | null = null;
  let bestY: number | null = null;
  let bestXDist = Infinity;
  let bestYDist = Infinity;

  for (const other of others) {
    const ox = edgesX(other);
    const oy = edgesY(other);

    for (const target of [ox.left, ox.centerX, ox.right]) {
      const dist = Math.abs(point.x - target);
      if (isWithinThreshold(point.x, target, zoom, threshold) && dist < bestXDist) {
        bestX = target;
        bestXDist = dist;
      }
    }
    for (const target of [oy.top, oy.centerY, oy.bottom]) {
      const dist = Math.abs(point.y - target);
      if (isWithinThreshold(point.y, target, zoom, threshold) && dist < bestYDist) {
        bestY = target;
        bestYDist = dist;
      }
    }
  }

  return { x: bestX, y: bestY };
}
