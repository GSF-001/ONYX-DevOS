export type ReviewState = "approved" | "changes_requested" | "commented" | "dismissed";

export interface Review {
  id: number;
  pullRequestId: number;
  reviewerLogin: string;
  state: ReviewState;
  submittedAt: string;
}

export interface ReviewerLoadEntry {
  reviewerLogin: string;
  pendingReviewCount: number;
  completedReviewCount30d: number;
  overloaded: boolean;
}
