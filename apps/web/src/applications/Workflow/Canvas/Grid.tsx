// Grid.tsx — infinite dot/line grid background that tracks camera transform

import React from "react";
import { CameraState } from "../WorkflowTypes";

interface GridProps {
  camera: CameraState;
  baseSize?: number;
}

export function Grid({ camera, baseSize = 24 }: GridProps) {
  const size = baseSize * camera.zoom;
  const offsetX = camera.x % size;
  const offsetY = camera.y % size;
  const majorEvery = 5;

  return (
    <svg className="wf-grid" width="100%" height="100%">
      <defs>
        <pattern
          id="wf-grid-minor"
          width={size}
          height={size}
          patternUnits="userSpaceOnUse"
          patternTransform={`translate(${offsetX}, ${offsetY})`}
        >
          <circle cx={1} cy={1} r={1} fill="rgba(0,0,0,0.18)" />
        </pattern>
        <pattern
          id="wf-grid-major"
          width={size * majorEvery}
          height={size * majorEvery}
          patternUnits="userSpaceOnUse"
          patternTransform={`translate(${offsetX}, ${offsetY})`}
        >
          <rect width={size * majorEvery} height={size * majorEvery} fill="url(#wf-grid-minor)" />
          <path
            d={`M ${size * majorEvery} 0 L 0 0 0 ${size * majorEvery}`}
            fill="none"
            stroke="rgba(0,0,0,0.08)"
            strokeWidth={1}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#wf-grid-major)" />
    </svg>
  );
}
