/**
 * ONYX DevOS — Developer Operating System
 * © 2026 GSF-001
 *
 * Proprietary Software.
 * Unauthorized use is strictly prohibited.
 */

// Rulers/RulerMarker.tsx

import React from "react";

interface RulerMarkerProps {
  position: number;
  label: string;
  orientation: "horizontal" | "vertical";
  major: boolean;
}

export const RulerMarker: React.FC<RulerMarkerProps> = ({ position, label, orientation, major }) => {
  const tickLength = major ? 8 : 4;

  if (orientation === "horizontal") {
    return (
      <div
        style={{
          position: "absolute",
          left: position,
          bottom: 0,
          width: 1,
          height: tickLength,
          background: "#9aa0ac",
        }}
      >
        {major && (
          <span
            style={{
              position: "absolute",
              bottom: tickLength + 1,
              left: 2,
              fontSize: 9,
              color: "#6b7280",
              whiteSpace: "nowrap",
            }}
          >
            {label}
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      style={{
        position: "absolute",
        top: position,
        right: 0,
        height: 1,
        width: tickLength,
        background: "#9aa0ac",
      }}
    >
      {major && (
        <span
          style={{
            position: "absolute",
            right: tickLength + 2,
            top: -5,
            fontSize: 9,
            color: "#6b7280",
            writingMode: "vertical-rl",
          }}
        >
          {label}
        </span>
      )}
    </div>
  );
};

export default RulerMarker;
