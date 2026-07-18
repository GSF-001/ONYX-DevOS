import { generateAvatarSpec } from "./IdentityAvatar";

interface IdentityPreviewProps {
  handle: string;
  developerId?: string;
  size?: number;
}

export function IdentityPreview({ handle, developerId, size = 96 }: IdentityPreviewProps) {
  const { cells, hue } = generateAvatarSpec(handle);
  const cellSize = size / 5;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <svg width={size} height={size} shapeRendering="crispEdges" style={{ border: "1px solid var(--win-border)" }}>
        <rect width={size} height={size} fill={`hsl(${hue}, 20%, 12%)`} />
        {cells.map((row, r) =>
          row.map((filled, c) =>
            filled ? (
              <rect
                key={`${r}-${c}`}
                x={c * cellSize}
                y={r * cellSize}
                width={cellSize}
                height={cellSize}
                fill={`hsl(${hue}, 70%, 55%)`}
              />
            ) : null
          )
        )}
      </svg>
      <p style={{ fontFamily: "var(--win-font-mono)", fontWeight: 700, fontSize: 13 }}>{handle}</p>
      {developerId && (
        <p style={{ fontSize: 11, color: "var(--win-text-dim)" }}>Developer ID: {developerId}</p>
      )}
    </div>
  );
}
