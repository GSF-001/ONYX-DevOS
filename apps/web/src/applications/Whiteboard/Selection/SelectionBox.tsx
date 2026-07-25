/**
 * ONYX DevOS — Developer Operating System
 * © 2026 GSF-001
 *
 * Proprietary Software.
 * Unauthorized use is strictly prohibited.
 */

// Selection/SelectionBox.tsx

import React from "react";
import { Rect } from "../WhiteboardTypes";

interface SelectionBoxProps {
  bounds: Rect;
  zoom: number;
  color?: string;
  dashed?: boolean;
}

export const SelectionBox: React.FC<SelectionBoxProps> = ({
  bounds,
  zoom,
  color = "#4d7cfe",
  dashed = false,
}) => {
  return (
    <div
      className="wb-selection-box"
      style={{
        position: "absolute",
        left: bounds.x * zoom,
        top: bounds.y * zoom,
        width: bounds.width * zoom,
        height: bounds.height * zoom,
        border: `1.5px ${dashed ? "dashed" : "solid"} ${color}`,
        pointerEvents: "none",
        boxSizing: "border-box",
        borderRadius: 2,
      }}
    />
  );
};

interface MarqueeBoxProps {
  rect: Rect;
}

export const MarqueeBox: React.FC<MarqueeBoxProps> = ({ rect }) => {
  return (
    <div
      className="wb-marquee-box"
      style={{
        position: "absolute",
        left: rect.x,
        top: rect.y,
        width: rect.width,
        height: rect.height,
        background: "rgba(77, 124, 254, 0.12)",
        border: "1px solid rgba(77, 124, 254, 0.6)",
        pointerEvents: "none",
      }}
    />
  );
};

export default SelectionBox;
