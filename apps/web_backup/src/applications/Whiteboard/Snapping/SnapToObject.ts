// Snapping/SnapToObject.ts

import { Rect, WhiteboardObject } from "../WhiteboardTypes";
import { getObjectBounds } from "../Collisions/BoundingBox";
import { closestWithinThreshold, OBJECT_SNAP_THRESHOLD_PX } from "./SnapThreshold";

interface EdgeSet {
  xs: number[];
  ys: number[];
}

function getEdges(rect: Rect): EdgeSet {
  return {
    xs: [rect.x, rect.x + rect.width / 2, rect.x + rect.width],
    ys: [rect.y, rect.y + rect.height / 2, rect.y + rect.height],
  };
}

export interface ObjectSnapResult {
  x: number | null;
  y: number | null;
  matchedXTarget: number | null;
  matchedYTarget: number | null;
}

export function snapRectToObjects(
  moving: Rect,
  others: WhiteboardObject[],
  zoom: number,
  threshold: number = OBJECT_SNAP_THRESHOLD_PX
): ObjectSnapResult {
  const movingEdges = getEdges(moving);
  const allXs: number[] = [];
  const allYs: number[] = [];

  others.forEach((o) => {
    const edges = getEdges(getObjectBounds(o));
    allXs.push(...edges.xs);
    allYs.push(...edges.ys);
  });

  let bestX: number | null = null;
  let bestXTarget: number | null = null;
  let bestXDist = Infinity;

  movingEdges.xs.forEach((edgeX, idx) => {
    const match = closestWithinThreshold(edgeX, allXs, zoom, threshold);
    if (match !== null) {
      const dist = Math.abs(edgeX - match);
      if (dist < bestXDist) {
        bestXDist = dist;
        bestXTarget = match;
        // translate moving.x so this edge aligns with match
        const offset = [0, moving.width / 2, moving.width][idx];
        bestX = match - offset;
      }
    }
  });

  let bestY: number | null = null;
  let bestYTarget: number | null = null;
  let bestYDist = Infinity;

  movingEdges.ys.forEach((edgeY, idx) => {
    const match = closestWithinThreshold(edgeY, allYs, zoom, threshold);
    if (match !== null) {
      const dist = Math.abs(edgeY - match);
      if (dist < bestYDist) {
        bestYDist = dist;
        bestYTarget = match;
        const offset = [0, moving.height / 2, moving.height][idx];
        bestY = match - offset;
      }
    }
  });

  return { x: bestX, y: bestY, matchedXTarget: bestXTarget, matchedYTarget: bestYTarget };
}
