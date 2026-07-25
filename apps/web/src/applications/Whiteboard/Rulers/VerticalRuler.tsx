/**
 * ONYX DevOS — Developer Operating System
 * © 2026 GSF-001
 *
 * Proprietary Software.
 * Unauthorized use is strictly prohibited.
 */

// Rulers/VerticalRuler.tsx

import React, { useMemo } from "react";
import { Camera } from "../WhiteboardTypes";
import { RulerMarker } from "./RulerMarker";

interface VerticalRulerProps {
  camera: Camera;
  height: number;
  baseStep?: number;
}

function pickStep(zoom: number, baseStep: number): number {
  let step = baseStep;
  while (step * zoom < 40) step *= 2;
  while (step * zoom > 160) step /= 2;
  return step;
}

export const VerticalRuler: React.FC<VerticalRulerProps> = ({ camera, height, baseStep = 50 }) => {
  const step = pickStep(camera.zoom, baseStep);

  const marks = useMemo(() => {
    const worldStart = -camera.y / camera.zoom;
    const worldEnd = (height - camera.y) / camera.zoom;
    const firstMark = Math.floor(worldStart / step) * step;
    const result: { worldY: number; screenY: number }[] = [];
    for (let y = firstMark; y <= worldEnd; y += step) {
      result.push({ worldY: y, screenY: y * camera.zoom + camera.y });
    }
    return result;
  }, [camera, step, height]);

  return (
    <div
      className="wb-ruler-vertical"
      style={{
        position: "relative",
        width: 20,
        height,
        background: "#ffffff",
        borderRight: "1px solid #e6e8ec",
        overflow: "hidden",
      }}
    >
      {marks.map((m, i) => (
        <RulerMarker
          key={i}
          position={m.screenY}
          label={String(Math.round(m.worldY))}
          orientation="vertical"
          major
        />
      ))}
    </div>
  );
};

export default VerticalRuler;
