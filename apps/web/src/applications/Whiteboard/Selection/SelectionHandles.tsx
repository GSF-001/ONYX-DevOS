// Selection/SelectionHandles.tsx

import React from "react";
import { Rect } from "../WhiteboardTypes";

export type HandlePosition =
  | "nw"
  | "n"
  | "ne"
  | "e"
  | "se"
  | "s"
  | "sw"
  | "w"
  | "rotate";

interface SelectionHandlesProps {
  bounds: Rect;
  zoom: number;
  onHandleDragStart: (handle: HandlePosition, e: React.PointerEvent) => void;
}

const HANDLE_SIZE = 8;

function getHandleCoords(bounds: Rect, zoom: number): Record<HandlePosition, { x: number; y: number }> {
  const x = bounds.x * zoom;
  const y = bounds.y * zoom;
  const w = bounds.width * zoom;
  const h = bounds.height * zoom;
  return {
    nw: { x, y },
    n: { x: x + w / 2, y },
    ne: { x: x + w, y },
    e: { x: x + w, y: y + h / 2 },
    se: { x: x + w, y: y + h },
    s: { x: x + w / 2, y: y + h },
    sw: { x, y: y + h },
    w: { x, y: y + h / 2 },
    rotate: { x: x + w / 2, y: y - 24 },
  };
}

const CURSORS: Record<HandlePosition, string> = {
  nw: "nwse-resize",
  n: "ns-resize",
  ne: "nesw-resize",
  e: "ew-resize",
  se: "nwse-resize",
  s: "ns-resize",
  sw: "nesw-resize",
  w: "ew-resize",
  rotate: "grab",
};

export const SelectionHandles: React.FC<SelectionHandlesProps> = ({
  bounds,
  zoom,
  onHandleDragStart,
}) => {
  const coords = getHandleCoords(bounds, zoom);
  const handles = Object.keys(coords) as HandlePosition[];

  return (
    <>
      {handles.map((handle) => {
        const pos = coords[handle];
        const isRotate = handle === "rotate";
        return (
          <div
            key={handle}
            onPointerDown={(e) => {
              e.stopPropagation();
              onHandleDragStart(handle, e);
            }}
            style={{
              position: "absolute",
              left: pos.x - HANDLE_SIZE / 2,
              top: pos.y - HANDLE_SIZE / 2,
              width: HANDLE_SIZE,
              height: HANDLE_SIZE,
              background: isRotate ? "transparent" : "#ffffff",
              border: isRotate ? "none" : "1.5px solid #4d7cfe",
              borderRadius: isRotate ? "50%" : 2,
              cursor: CURSORS[handle],
              zIndex: 10,
            }}
          >
            {isRotate && (
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  border: "1.5px solid #4d7cfe",
                  background: "#ffffff",
                }}
              />
            )}
          </div>
        );
      })}
    </>
  );
};

export default SelectionHandles;
