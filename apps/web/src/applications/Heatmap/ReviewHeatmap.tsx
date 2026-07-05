// Heatmap/ReviewHeatmap.tsx
import { EmptyState } from "../../shared/components";

/** Honest gap: scoring/weekendHeatmap.ts only aggregates commits, not
 * review timestamps. A review-specific heatmap would need its own
 * scoring function on the backend. */
export function ReviewHeatmap() {
  return (
    <EmptyState
      title="Review heatmap isn't computed yet"
      description="The backend's heatmap aggregation only reads the commits table. Reviews would need a separate day/hour aggregation function."
    />
  );
}
