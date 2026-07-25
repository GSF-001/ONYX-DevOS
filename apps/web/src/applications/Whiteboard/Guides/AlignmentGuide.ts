/**
 * ONYX DevOS — Developer Operating System
 * © 2026 GSF-001
 *
 * Proprietary Software.
 * Unauthorized use is strictly prohibited.
 */

// Guides/AlignmentGuide.ts

import { GuideLineData, Rect, WhiteboardObject, makeId } from "../WhiteboardTypes";
import { getObjectBounds } from "../Collisions/BoundingBox";

export type AlignmentType =
  | "left"
  | "center-x"
  | "right"
  | "top"
  | "center-y"
  | "bottom";

export function alignObjects(objects: WhiteboardObject[], type: AlignmentType): Record<string, Partial<Rect>> {
  if (objects.length < 2) return {};
  const bounds = objects.map((o) => getObjectBounds(o));

  const result: Record<string, Partial<Rect>> = {};

  switch (type) {
    case "left": {
      const minX = Math.min(...bounds.map((b) => b.x));
      objects.forEach((o) => (result[o.id] = { x: minX }));
      break;
    }
    case "right": {
      const maxRight = Math.max(...bounds.map((b) => b.x + b.width));
      objects.forEach((o) => (result[o.id] = { x: maxRight - o.width }));
      break;
    }
    case "center-x": {
      const avgCenter =
        bounds.reduce((sum, b) => sum + b.x + b.width / 2, 0) / bounds.length;
      objects.forEach((o) => (result[o.id] = { x: avgCenter - o.width / 2 }));
      break;
    }
    case "top": {
      const minY = Math.min(...bounds.map((b) => b.y));
      objects.forEach((o) => (result[o.id] = { y: minY }));
      break;
    }
    case "bottom": {
      const maxBottom = Math.max(...bounds.map((b) => b.y + b.height));
      objects.forEach((o) => (result[o.id] = { y: maxBottom - o.height }));
      break;
    }
    case "center-y": {
      const avgCenter =
        bounds.reduce((sum, b) => sum + b.y + b.height / 2, 0) / bounds.length;
      objects.forEach((o) => (result[o.id] = { y: avgCenter - o.height / 2 }));
      break;
    }
  }

  return result;
}

export function distributeObjects(
  objects: WhiteboardObject[],
  axis: "horizontal" | "vertical"
): Record<string, Partial<Rect>> {
  if (objects.length < 3) return {};
  const sorted = [...objects].sort((a, b) =>
    axis === "horizontal" ? a.x - b.x : a.y - b.y
  );

  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  const totalSpan =
    axis === "horizontal"
      ? last.x + last.width - first.x
      : last.y + last.height - first.y;
  const totalSize = sorted.reduce(
    (sum, o) => sum + (axis === "horizontal" ? o.width : o.height),
    0
  );
  const gap = (totalSpan - totalSize) / (sorted.length - 1);

  const result: Record<string, Partial<Rect>> = {};
  let cursor = axis === "horizontal" ? first.x : first.y;

  sorted.forEach((o) => {
    if (axis === "horizontal") {
      result[o.id] = { x: cursor };
      cursor += o.width + gap;
    } else {
      result[o.id] = { y: cursor };
      cursor += o.height + gap;
    }
  });

  return result;
}

export function detectEqualEdgeGuides(
  moving: Rect,
  others: WhiteboardObject[]
): GuideLineData[] {
  const guides: GuideLineData[] = [];
  const movingCenterX = moving.x + moving.width / 2;
  const movingCenterY = moving.y + moving.height / 2;

  others.forEach((o) => {
    const bounds = getObjectBounds(o);
    const centerX = bounds.x + bounds.width / 2;
    const centerY = bounds.y + bounds.height / 2;

    if (Math.abs(centerX - movingCenterX) < 0.5) {
      guides.push({ id: makeId("guide"), orientation: "vertical", position: centerX });
    }
    if (Math.abs(centerY - movingCenterY) < 0.5) {
      guides.push({ id: makeId("guide"), orientation: "horizontal", position: centerY });
    }
  });

  return guides;
}
