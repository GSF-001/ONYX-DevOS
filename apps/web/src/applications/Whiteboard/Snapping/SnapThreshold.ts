/**
 * ONYX DevOS — Developer Operating System
 * © 2026 GSF-001
 *
 * Proprietary Software.
 * Unauthorized use is strictly prohibited.
 */

// Snapping/SnapThreshold.ts

export const DEFAULT_SNAP_THRESHOLD_PX = 8;
export const GRID_SNAP_THRESHOLD_PX = 6;
export const OBJECT_SNAP_THRESHOLD_PX = 8;

/**
 * Returns true when `value` is within `threshold` distance of `target`,
 * accounting for the current camera zoom so the on-screen tolerance
 * stays consistent regardless of zoom level.
 */
export function isWithinThreshold(
  value: number,
  target: number,
  zoom: number,
  threshold: number = DEFAULT_SNAP_THRESHOLD_PX
): boolean {
  const worldThreshold = threshold / Math.max(zoom, 0.0001);
  return Math.abs(value - target) <= worldThreshold;
}

export function closestWithinThreshold(
  value: number,
  candidates: number[],
  zoom: number,
  threshold: number = DEFAULT_SNAP_THRESHOLD_PX
): number | null {
  let best: number | null = null;
  let bestDist = Infinity;
  for (const c of candidates) {
    const dist = Math.abs(value - c);
    if (dist <= threshold / Math.max(zoom, 0.0001) && dist < bestDist) {
      best = c;
      bestDist = dist;
    }
  }
  return best;
}
