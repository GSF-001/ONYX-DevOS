import type { ReviewerLoadEntry } from "../../shared/types";
import type { ReciprocityPair } from "../../shared/api/endpoints";

export interface ReviewsViewState {
  reviewerLoad: ReviewerLoadEntry[];
  reciprocityGap: ReciprocityPair[];
  loading: boolean;
  error: string | null;
}

export type { ReviewerLoadEntry, ReciprocityPair };
