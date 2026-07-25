// Collisions/Overlap.ts

import { Rect } from "../WhiteboardTypes";

export function getIntersectionRect(a: Rect, b: Rect): Rect | null {
  const x1 = Math.max(a.x, b.x);
  const y1 = Math.max(a.y, b.y);
  const x2 = Math.min(a.x + a.width, b.x + b.width);
  const y2 = Math.min(a.y + a.height, b.y + b.height);
  if (x2 <= x1 || y2 <= y1) return null;
  return { x: x1, y: y1, width: x2 - x1, height: y2 - y1 };
}

export function getOverlapArea(a: Rect, b: Rect): number {
  const intersection = getIntersectionRect(a, b);
  if (!intersection) return 0;
  return intersection.width * intersection.height;
}

export function getOverlapPercentage(a: Rect, b: Rect): number {
  const overlapArea = getOverlapArea(a, b);
  const smallerArea = Math.min(a.width * a.height, b.width * b.height);
  if (smallerArea === 0) return 0;
  return overlapArea / smallerArea;
}

export function isFullyContained(inner: Rect, outer: Rect): boolean {
  return (
    inner.x >= outer.x &&
    inner.y >= outer.y &&
    inner.x + inner.width <= outer.x + outer.width &&
    inner.y + inner.height <= outer.y + outer.height
  );
}

export function intersectionOverUnion(a: Rect, b: Rect): number {
  const overlap = getOverlapArea(a, b);
  const unionArea = a.width * a.height + b.width * b.height - overlap;
  if (unionArea === 0) return 0;
  return overlap / unionArea;
}
