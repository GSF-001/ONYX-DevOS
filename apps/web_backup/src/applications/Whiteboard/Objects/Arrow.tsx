// Objects/Arrow.tsx

import React from "react";
import { ArrowObject } from "../WhiteboardTypes";

interface ArrowProps {
  object: ArrowObject;
  selected: boolean;
}

function buildPath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return "";
  const [first, ...rest] = points;
  return `M ${first.x} ${first.y} ` + rest.map((p) => `L ${p.x} ${p.y}`).join(" ");
}

export const Arrow: React.FC<ArrowProps> = ({ object, selected }) => {
  const path = buildPath(object.points);
  const markerId = `arrowhead-${object.id}`;
  const startMarkerId = `arrowstart-${object.id}`;

  return (
    <svg
      className="wb-object wb-arrow"
      width="100%"
      height="100%"
      style={{ overflow: "visible" }}
    >
      <defs>
        <marker
          id={markerId}
          markerWidth="10"
          markerHeight="10"
          refX="8"
          refY="5"
          orient="auto"
        >
          <path d="M0,0 L10,5 L0,10 Z" fill={object.stroke} />
        </marker>
        <marker
          id={startMarkerId}
          markerWidth="10"
          markerHeight="10"
          refX="2"
          refY="5"
          orient="auto"
        >
          <path d="M10,0 L0,5 L10,10 Z" fill={object.stroke} />
        </marker>
      </defs>
      <path
        d={path}
        fill="none"
        stroke={selected ? "#4d7cfe" : object.stroke}
        strokeWidth={object.strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        markerEnd={object.endCap === "arrow" ? `url(#${markerId})` : undefined}
        markerStart={object.startCap === "arrow" ? `url(#${startMarkerId})` : undefined}
      />
    </svg>
  );
};

export default Arrow;
