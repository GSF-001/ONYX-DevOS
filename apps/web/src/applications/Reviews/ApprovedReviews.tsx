// Reviews/ApprovedReviews.tsx
import { EmptyState } from "../../shared/components";

export function ApprovedReviews() {
  return (
    <EmptyState
      title="Per-review status list isn't exposed yet"
      description="Same backend gap as Pending — needs a raw reviews list endpoint."
    />
  );
}
