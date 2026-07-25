/**
 * ONYX DevOS — Developer Operating System
 * © 2026 GSF-001
 *
 * Proprietary Software.
 * Unauthorized use is strictly prohibited.
 */

// Canvas/Background.tsx

import React from "react";

interface BackgroundProps {
  color?: string;
  pattern?: "none" | "dots" | "lines";
}

export const Background: React.FC<BackgroundProps> = ({ color = "#fafbfc", pattern = "none" }) => {
  return (
    <div
      className="wb-background"
      style={{
        position: "absolute",
        inset: 0,
        background: color,
        backgroundImage:
          pattern === "dots"
            ? "radial-gradient(circle, #d7dae0 1px, transparent 1px)"
            : pattern === "lines"
            ? "linear-gradient(#e6e8ec 1px, transparent 1px), linear-gradient(90deg, #e6e8ec 1px, transparent 1px)"
            : undefined,
        backgroundSize: pattern === "dots" ? "20px 20px" : pattern === "lines" ? "40px 40px" : undefined,
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
};

export default Background;
