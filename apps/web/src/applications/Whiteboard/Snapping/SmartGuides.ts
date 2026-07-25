/**
 * ONYX DevOS — Developer Operating System
 * © 2026 GSF-001
 *
 * Proprietary Software.
 * Unauthorized use is strictly prohibited.
 */

// Snapping/SmartGuides.ts

import { GuideLineData, Rect, SnapResult, WhiteboardObject } from "../WhiteboardTypes";
import { snapRectToObjects } from "./SnapToObject";
import { snapPointToGrid } from "./SnapToGrid";
import { makeId } from "../WhiteboardTypes";

export interface SmartGuideOptions {
  gridEnabled: boolean;
  gridSize: number;
  objectSnapEnabled: boolean;
  zoom: number;
}

export function computeSmartGuides(
  moving: Rect,
  others: WhiteboardObject[],
  options: SmartGuideOptions
): SnapResult {
  const guides: GuideLineData[] = [];
  let snappedX: number | null = null;
  let snappedY: number | null = null;

  if (options.objectSnapEnabled) {
    const objectSnap = snapRectToObjects(moving, others, options.zoom);
    if (objectSnap.x !== null) {
      snappedX = objectSnap.x;
      guides.push({
        id: makeId("guide"),
        orientation: "vertical",
        position: objectSnap.matchedXTarget ?? objectSnap.x,
        color: "#ff4d6d",
      });
    }
    if (objectSnap.y !== null) {
      snappedY = objectSnap.y;
      guides.push({
        id: makeId("guide"),
        orientation: "horizontal",
        position: objectSnap.matchedYTarget ?? objectSnap.y,
        color: "#ff4d6d",
      });
    }
  }

  if (options.gridEnabled && snappedX === null && snappedY === null) {
    const gridPoint = snapPointToGrid({ x: moving.x, y: moving.y }, options.gridSize);
    if (Math.abs(gridPoint.x - moving.x) < options.gridSize) snappedX = gridPoint.x;
    if (Math.abs(gridPoint.y - moving.y) < options.gridSize) snappedY = gridPoint.y;
  }

  return { x: snappedX, y: snappedY, guides };
}

export function clearGuidesAfterDelay(
  setGuides: (guides: GuideLineData[]) => void,
  delayMs = 600
): () => void {
  const timeout = setTimeout(() => setGuides([]), delayMs);
  return () => clearTimeout(timeout);
}
