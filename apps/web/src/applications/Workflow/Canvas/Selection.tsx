/**
 * ONYX DevOS — Developer Operating System
 * © 2026 GSF-001
 *
 * Proprietary Software.
 * Unauthorized use is strictly prohibited.
 */

// Selection.tsx — rubber-band multi-select over the canvas

import React, { useCallback, useState } from "react";
import { CameraState, Vec2, AnyWorkflowNode } from "../WorkflowTypes";
import { screenToWorld } from "./Camera";

interface SelectionBoxState {
  start: Vec2;
  current: Vec2;
}

interface UseSelectionArgs {
  camera: CameraState;
  nodes: AnyWorkflowNode[];
  onSelect: (ids: string[]) => void;
}

function rectsIntersect(a: { x: number; y: number; w: number; h: number }, b: { x: number; y: number; w: number; h: number }) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

export function useSelectionBox({ camera, nodes, onSelect }: UseSelectionArgs) {
  const [box, setBox] = useState<SelectionBoxState | null>(null);

  const beginSelection = useCallback((screenPoint: Vec2) => {
    setBox({ start: screenPoint, current: screenPoint });
  }, []);

  const updateSelection = useCallback((screenPoint: Vec2) => {
    setBox((prev) => (prev ? { ...prev, current: screenPoint } : prev));
  }, []);

  const endSelection = useCallback(() => {
    if (!box) return;
    const worldStart = screenToWorld(box.start, camera);
    const worldEnd = screenToWorld(box.current, camera);
    const selRect = {
      x: Math.min(worldStart.x, worldEnd.x),
      y: Math.min(worldStart.y, worldEnd.y),
      w: Math.abs(worldEnd.x - worldStart.x),
      h: Math.abs(worldEnd.y - worldStart.y),
    };
    const hits = nodes
      .filter((n) => rectsIntersect(selRect, { x: n.position.x, y: n.position.y, w: n.size.x, h: n.size.y }))
      .map((n) => n.id);
    onSelect(hits);
    setBox(null);
  }, [box, camera, nodes, onSelect]);

  const rect = box
    ? {
        left: Math.min(box.start.x, box.current.x),
        top: Math.min(box.start.y, box.current.y),
        width: Math.abs(box.current.x - box.start.x),
        height: Math.abs(box.current.y - box.start.y),
      }
    : null;

  return { rect, beginSelection, updateSelection, endSelection, active: box !== null };
}

export function SelectionOverlay({ rect }: { rect: { left: number; top: number; width: number; height: number } | null }) {
  if (!rect) return null;
  return (
    <div
      className="wf-selection-box"
      style={{ left: rect.left, top: rect.top, width: rect.width, height: rect.height }}
    />
  );
}
