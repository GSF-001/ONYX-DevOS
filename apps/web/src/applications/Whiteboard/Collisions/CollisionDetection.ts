/**
 * ONYX DevOS — Developer Operating System
 * © 2026 GSF-001
 *
 * Proprietary Software.
 * Unauthorized use is strictly prohibited.
 */

// Collisions/CollisionDetection.ts

import { Rect, WhiteboardObject } from "../WhiteboardTypes";
import { getObjectBounds } from "./BoundingBox";
import { getIntersectionRect, getOverlapPercentage } from "./Overlap";

export function rectsIntersect(a: Rect, b: Rect): boolean {
  return !(
    a.x + a.width < b.x ||
    b.x + b.width < a.x ||
    a.y + a.height < b.y ||
    b.y + b.height < a.y
  );
}

export function findCollidingObjects(
  target: WhiteboardObject,
  objects: WhiteboardObject[]
): WhiteboardObject[] {
  const targetBounds = getObjectBounds(target);
  return objects.filter((o) => {
    if (o.id === target.id) return false;
    return rectsIntersect(targetBounds, getObjectBounds(o));
  });
}

export function findObjectsWithinRect(
  rect: Rect,
  objects: WhiteboardObject[],
  minOverlap = 0
): WhiteboardObject[] {
  return objects.filter((o) => {
    const bounds = getObjectBounds(o);
    if (minOverlap <= 0) return rectsIntersect(rect, bounds);
    return getOverlapPercentage(rect, bounds) >= minOverlap;
  });
}

export function findObjectsFullyInsideFrame(
  frame: WhiteboardObject,
  objects: WhiteboardObject[]
): WhiteboardObject[] {
  const frameBounds = getObjectBounds(frame);
  return objects.filter((o) => {
    if (o.id === frame.id) return false;
    const bounds = getObjectBounds(o);
    const intersection = getIntersectionRect(frameBounds, bounds);
    if (!intersection) return false;
    const area = bounds.width * bounds.height;
    if (area === 0) return false;
    const intersectionArea = intersection.width * intersection.height;
    return intersectionArea / area > 0.5;
  });
}

export function pointIntersectsRect(point: { x: number; y: number }, rect: Rect): boolean {
  return (
    point.x >= rect.x &&
    point.x <= rect.x + rect.width &&
    point.y >= rect.y &&
    point.y <= rect.y + rect.height
  );
}
