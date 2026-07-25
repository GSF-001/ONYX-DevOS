/**
 * ONYX DevOS — Developer Operating System
 * © 2026 GSF-001
 *
 * Proprietary Software.
 * Unauthorized use is strictly prohibited.
 */

// EdgeLabel.tsx — renders an edge's condition/label centered on its path midpoint

import React from "react";
import { Vec2 } from "../WorkflowTypes";

interface Props {
  point: Vec2;
  text: string;
  tone?: "true" | "false" | "default";
}

const TONE_COLOR: Record<string, string> = {
  true: "#2e8b57",
  false: "#8b2e2e",
  default: "#3a3a3a",
};

export function EdgeLabel({ point, text, tone = "default" }: Props) {
  if (!text) return null;
  const width = Math.max(24, text.length * 6.2 + 12);
  return (
    <g transform={`translate(${point.x - width / 2}, ${point.y - 9})`}>
      <rect width={width} height={18} rx={4} fill={TONE_COLOR[tone]} stroke="#000" strokeWidth={1} />
      <text x={width / 2} y={13} textAnchor="middle" fontSize={10} fill="#fff" fontFamily="'MS Sans Serif', Tahoma, sans-serif">
        {text}
      </text>
    </g>
  );
}
