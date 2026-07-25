// Widgets/ColorSwatch.tsx

import React from "react";

export const DEFAULT_PALETTE: string[] = [
  "#fff3b0",
  "#ffc9c9",
  "#b2f2bb",
  "#a5d8ff",
  "#eebefa",
  "#ffd8a8",
  "#c3fae8",
  "#d0bfff",
  "#ffffff",
  "#e9ecef",
  "#1c1f26",
  "#4d7cfe",
];

interface ColorSwatchProps {
  colors?: string[];
  value: string;
  onChange: (color: string) => void;
  allowCustom?: boolean;
}

export const ColorSwatch: React.FC<ColorSwatchProps> = ({
  colors = DEFAULT_PALETTE,
  value,
  onChange,
  allowCustom = true,
}) => {
  return (
    <div
      className="wb-color-swatch"
      style={{ display: "flex", flexWrap: "wrap", gap: 6, maxWidth: 168 }}
    >
      {colors.map((color) => {
        const isActive = color.toLowerCase() === value.toLowerCase();
        return (
          <button
            key={color}
            onClick={() => onChange(color)}
            title={color}
            style={{
              width: 22,
              height: 22,
              borderRadius: "50%",
              background: color,
              border: isActive ? "2px solid #4d7cfe" : "1px solid rgba(0,0,0,0.12)",
              cursor: "pointer",
              boxShadow: isActive ? "0 0 0 2px rgba(77,124,254,0.25)" : "none",
              padding: 0,
            }}
          />
        );
      })}
      {allowCustom && (
        <label
          title="Custom color"
          style={{
            width: 22,
            height: 22,
            borderRadius: "50%",
            border: "1px dashed #9aa0ac",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            fontSize: 11,
            position: "relative",
            overflow: "hidden",
          }}
        >
          +
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }}
          />
        </label>
      )}
    </div>
  );
};

export default ColorSwatch;
