export interface FeedPost {
  id: number;
  type: "project" | "discussion" | "showcase" | "event";
  title: string;
  body: string;
  url: string | null;
  eventAt: string | null;
  authorLogin: string;
  authorAvatarUrl: string | null;
  createdAt: string;
  likeCount: number;
  commentCount: number;
}

export interface DeveloperSummary {
  userId: number;
  login: string;
  avatarUrl: string | null;
  pullRequestCount: number;
  reviewCount: number;
  postCount: number;
}

export interface LeaderboardEntry {
  rank: number;
  login: string;
  avatarUrl: string | null;
  score: number;
}

export interface CommunityViewState {
  feed: FeedPost[];
  loading: boolean;
  error: string | null;
}
