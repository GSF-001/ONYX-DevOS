import { generateAvatarSpec } from "../../identity/IdentityAvatar";

interface IdentityAvatarProps {
  handle: string;
  size?: number;
}

/** Thin shared wrapper around identity/IdentityAvatar.ts's generator, for
 * places that just need a small inline avatar (chat messages, member
 * lists) without the full IdentityPreview card. */
export function IdentityAvatar({ handle, size = 24 }: IdentityAvatarProps) {
  const { cells, hue } = generateAvatarSpec(handle);
  const cellSize = size / 5;

  return (
    <svg width={size} height={size} shapeRendering="crispEdges" style={{ flexShrink: 0 }}>
      <rect width={size} height={size} fill={`hsl(${hue}, 20%, 12%)`} />
      {cells.map((row, r) =>
        row.map((filled, c) =>
          filled ? (
            <rect key={`${r}-${c}`} x={c * cellSize} y={r * cellSize} width={cellSize} height={cellSize} fill={`hsl(${hue}, 70%, 55%)`} />
          ) : null
        )
      )}
    </svg>
  );
}
