/**
 * ONYX DevOS — Developer Operating System
 * © 2026 GSF-001
 *
 * Proprietary Software.
 * Unauthorized use is strictly prohibited.
 */

// Canvas/Grid.tsx

import React, { useMemo } from "react";
import { Camera } from "../WhiteboardTypes";

interface GridProps {
  camera: Camera;
  gridSize: number;
  viewportWidth: number;
  viewportHeight: number;
  enabled: boolean;
}

export const Grid: React.FC<GridProps> = ({
  camera,
  gridSize,
  viewportWidth,
  viewportHeight,
  enabled,
}) => {
  const scaledSize = gridSize * camera.zoom;

  const offsetX = useMemo(() => {
    return ((camera.x % scaledSize) + scaledSize) % scaledSize;
  }, [camera.x, scaledSize]);

  const offsetY = useMemo(() => {
    return ((camera.y % scaledSize) + scaledSize) % scaledSize;
  }, [camera.y, scaledSize]);

  if (!enabled || scaledSize < 4) return null;

  const dotColor = camera.zoom < 0.4 ? "rgba(0,0,0,0.06)" : "rgba(0,0,0,0.12)";

  return (
    <svg
      className="wb-grid"
      width={viewportWidth}
      height={viewportHeight}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      <defs>
        <pattern
          id="wb-grid-pattern"
          x={offsetX}
          y={offsetY}
          width={scaledSize}
          height={scaledSize}
          patternUnits="userSpaceOnUse"
        >
          <circle cx={1} cy={1} r={1} fill={dotColor} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#wb-grid-pattern)" />
    </svg>
  );
};

export default Grid;
