import { generateAvatarSpec } from "../../identity/IdentityAvatar";

interface IdentityAvatarProps {
  handle: string;
  size?: number;
}

/**
 * Deterministic pixel-avatar renderer. Same handle always produces the
 * same avatar — no external image service, no static placeholder image,
 * no random/fake data. The hash + 5x5 symmetric grid generation happens
 * in identity/IdentityAvatar.ts; this component just draws it as SVG.
 */
export function IdentityAvatar({ handle, size = 24 }: IdentityAvatarProps) {
  const { cells, hue } = generateAvatarSpec(handle);
  const cellSize = size / 5;

  return (
    <svg width={size} height={size} shapeRendering="crispEdges" style={{ flexShrink: 0 }}>
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
  );
}
