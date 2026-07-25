// Objects/Rectangle.tsx

import React from "react";
import { RectangleObject } from "../WhiteboardTypes";

interface RectangleProps {
  object: RectangleObject;
  selected: boolean;
}

export const Rectangle: React.FC<RectangleProps> = ({ object, selected }) => {
  return (
    <svg
      className="wb-object wb-rectangle"
      width="100%"
      height="100%"
      style={{ overflow: "visible" }}
    >
      <rect
        x={object.strokeWidth / 2}
        y={object.strokeWidth / 2}
        width={Math.max(0, object.width - object.strokeWidth)}
        height={Math.max(0, object.height - object.strokeWidth)}
        rx={object.cornerRadius}
        ry={object.cornerRadius}
        fill={object.fill}
        stroke={selected ? "#4d7cfe" : object.stroke}
        strokeWidth={object.strokeWidth}
      />
    </svg>
  );
};

export default Rectangle;
