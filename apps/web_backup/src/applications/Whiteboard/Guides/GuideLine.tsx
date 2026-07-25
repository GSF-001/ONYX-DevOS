// Guides/GuideLine.tsx

import React from "react";
import { Camera, GuideLineData } from "../WhiteboardTypes";

interface GuideLineProps {
  guide: GuideLineData;
  camera: Camera;
  viewportWidth: number;
  viewportHeight: number;
  onRemove?: (id: string) => void;
}

export const GuideLine: React.FC<GuideLineProps> = ({
  guide,
  camera,
  viewportWidth,
  viewportHeight,
  onRemove,
}) => {
  const isVertical = guide.orientation === "vertical";
  const screenPos = isVertical
    ? guide.position * camera.zoom + camera.x
    : guide.position * camera.zoom + camera.y;

  const color = guide.color ?? "#ff4d6d";

  return (
    <div
      onDoubleClick={() => onRemove?.(guide.id)}
      style={{
        position: "absolute",
        left: isVertical ? screenPos : 0,
        top: isVertical ? 0 : screenPos,
        width: isVertical ? 1 : viewportWidth,
        height: isVertical ? viewportHeight : 1,
        background: color,
        pointerEvents: onRemove ? "auto" : "none",
        cursor: onRemove ? "pointer" : "default",
        zIndex: 15,
      }}
    />
  );
};

export default GuideLine;
