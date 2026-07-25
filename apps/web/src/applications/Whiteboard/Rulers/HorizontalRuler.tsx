/**
 * ONYX DevOS — Developer Operating System
 * © 2026 GSF-001
 *
 * Proprietary Software.
 * Unauthorized use is strictly prohibited.
 */

// Rulers/HorizontalRuler.tsx

import React, { useMemo } from "react";
import { Camera } from "../WhiteboardTypes";
import { RulerMarker } from "./RulerMarker";

interface HorizontalRulerProps {
  camera: Camera;
  width: number;
  baseStep?: number;
}

function pickStep(zoom: number, baseStep: number): number {
  let step = baseStep;
  while (step * zoom < 40) step *= 2;
  while (step * zoom > 160) step /= 2;
  return step;
}

export const HorizontalRuler: React.FC<HorizontalRulerProps> = ({ camera, width, baseStep = 50 }) => {
  const step = pickStep(camera.zoom, baseStep);

  const marks = useMemo(() => {
    const worldStart = -camera.x / camera.zoom;
    const worldEnd = (width - camera.x) / camera.zoom;
    const firstMark = Math.floor(worldStart / step) * step;
    const result: { worldX: number; screenX: number }[] = [];
    for (let x = firstMark; x <= worldEnd; x += step) {
      result.push({ worldX: x, screenX: x * camera.zoom + camera.x });
    }
    return result;
  }, [camera, step, width]);

  return (
    <div
      className="wb-ruler-horizontal"
      style={{
        position: "relative",
        height: 20,
        width,
        background: "#ffffff",
        borderBottom: "1px solid #e6e8ec",
        overflow: "hidden",
      }}
    >
      {marks.map((m, i) => (
        <RulerMarker
          key={i}
          position={m.screenX}
          label={String(Math.round(m.worldX))}
          orientation="horizontal"
          major
        />
      ))}
    </div>
  );
};

export default HorizontalRuler;
