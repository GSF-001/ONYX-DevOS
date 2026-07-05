// Repository/Commits.tsx
import { EmptyState } from "../../shared/components";

/**
 * Commits ARE stored server-side (db/schema.ts `commits` table, populated
 * by push-event webhooks and repository sync) but there's no route that
 * returns a plain commit list — only aggregated views (bus factor, commit
 * decay, weekend heatmap) exist. This tab is honest about that gap rather
 * than faking a commit feed.
 */
export function Commits() {
  return (
    <EmptyState
      title="Raw commit list isn't exposed yet"
      description="Commit data exists in the database and powers Insights (bus factor, commit decay), but there's no GET /repositories/:id/commits endpoint yet for a plain list view."
    />
  );
}
