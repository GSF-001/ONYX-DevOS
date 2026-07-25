/**
 * ONYX DevOS — Developer Operating System
 * © 2026 GSF-001
 *
 * Proprietary Software.
 * Unauthorized use is strictly prohibited.
 */

// Objects/Ellipse.tsx

import React from "react";
import { EllipseObject } from "../WhiteboardTypes";

interface EllipseProps {
  object: EllipseObject;
  selected: boolean;
}

export const Ellipse: React.FC<EllipseProps> = ({ object, selected }) => {
  const rx = Math.max(0, object.width / 2 - object.strokeWidth / 2);
  const ry = Math.max(0, object.height / 2 - object.strokeWidth / 2);

  return (
    <svg className="wb-object wb-ellipse" width="100%" height="100%" style={{ overflow: "visible" }}>
      <ellipse
        cx={object.width / 2}
        cy={object.height / 2}
        rx={rx}
        ry={ry}
        fill={object.fill}
        stroke={selected ? "#4d7cfe" : object.stroke}
        strokeWidth={object.strokeWidth}
      />
    </svg>
  );
};

export default Ellipse;
