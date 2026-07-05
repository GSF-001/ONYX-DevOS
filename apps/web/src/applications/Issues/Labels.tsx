// Issues/Labels.tsx
import { EmptyState } from "../../shared/components";

/** GitHub labels aren't stored at all — the `issues` table has no labels
 * column and there's no labels sync. */
export function Labels() {
  return (
    <EmptyState
      title="Labels aren't tracked yet"
      description="The issues table has no labels column, and there's no GitHub labels sync yet."
    />
  );
}
