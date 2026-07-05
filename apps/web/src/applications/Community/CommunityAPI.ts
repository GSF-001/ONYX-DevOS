import { apiClient } from "../../shared/api";
import type { DeveloperSummary, FeedPost, LeaderboardEntry } from "./CommunityTypes";

export const CommunityAPI = {
  getFeed: () => apiClient.get<FeedPost[]>("/api/community/feed"),
  getTrending: () => apiClient.get<FeedPost[]>("/api/community/trending"),
  getProjects: () => apiClient.get<FeedPost[]>("/api/community/projects"),
  getDiscussions: () => apiClient.get<FeedPost[]>("/api/community/discussions"),
  getShowcase: () => apiClient.get<FeedPost[]>("/api/community/showcase"),
  getEvents: () => apiClient.get<FeedPost[]>("/api/community/events"),
  getDevelopers: () => apiClient.get<DeveloperSummary[]>("/api/community/developers"),
  getLeaderboard: () => apiClient.get<LeaderboardEntry[]>("/api/community/leaderboard"),
  createPost: (input: { type: FeedPost["type"]; title: string; body: string; url?: string; eventAt?: string }) =>
    apiClient.post<FeedPost>("/api/community/posts", input),
  likePost: (postId: number) => apiClient.post<{ ok: true }>(`/api/community/posts/${postId}/like`),
  unlikePost: (postId: number) => apiClient.delete<{ ok: true }>(`/api/community/posts/${postId}/like`),
  commentOnPost: (postId: number, body: string) =>
    apiClient.post<{ id: number }>(`/api/community/posts/${postId}/comments`, { body }),
};
