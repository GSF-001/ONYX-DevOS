// Selection/HitTest.ts

import { Point, WhiteboardObject } from "../WhiteboardTypes";
import { getRotatedCorners } from "../Collisions/BoundingBox";

function pointInPolygon(point: Point, polygon: Point[]): boolean {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x;
    const yi = polygon[i].y;
    const xj = polygon[j].x;
    const yj = polygon[j].y;
    const intersect =
      yi > point.y !== yj > point.y &&
      point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

export function hitTestObject(point: Point, obj: WhiteboardObject): boolean {
  if (obj.rotation === 0) {
    return (
      point.x >= obj.x &&
      point.x <= obj.x + obj.width &&
      point.y >= obj.y &&
      point.y <= obj.y + obj.height
    );
  }
  const corners = getRotatedCorners(
    { x: obj.x, y: obj.y, width: obj.width, height: obj.height },
    obj.rotation
  );
  return pointInPolygon(point, corners);
}

/**
 * Returns the topmost (highest zIndex) object under the given point,
 * skipping locked or invisible objects.
 */
export function hitTestTopmost(
  point: Point,
  objects: WhiteboardObject[]
): WhiteboardObject | null {
  const candidates = objects
    .filter((o) => o.visible && hitTestObject(point, o))
    .sort((a, b) => b.zIndex - a.zIndex);
  return candidates[0] ?? null;
}

export function hitTestAll(point: Point, objects: WhiteboardObject[]): WhiteboardObject[] {
  return objects
    .filter((o) => o.visible && hitTestObject(point, o))
    .sort((a, b) => b.zIndex - a.zIndex);
}

export function hitTestHandle(
  point: Point,
  handlePos: Point,
  radius = 6
): boolean {
  const dx = point.x - handlePos.x;
  const dy = point.y - handlePos.y;
  return Math.sqrt(dx * dx + dy * dy) <= radius;
}
