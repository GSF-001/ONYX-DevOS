import { apiClient } from "./client";
import type {
  ActivityScoreResult,
  Issue,
  PullRequest,
  Repository,
  Review,
  ReviewerLoadEntry,
  Team,
  TeamMember,
  TimelineEvent,
  User,
  WeekendHeatmapResult,
} from "../types";

/* ---------------------------------- auth ---------------------------------- */

export function getCurrentUser(signal?: AbortSignal) {
  return apiClient.get<User>("/auth/me", signal);
}

export function logout() {
  return apiClient.post<{ ok: true }>("/auth/logout");
}

/* -------------------------------- dashboard -------------------------------- */

export interface DashboardResponse {
  team: Team;
  repositories: { id: number; fullName: string }[];
  scores: { repositoryId: number; activityScore: ActivityScoreResult }[];
}

export function getDashboard(teamSlug: string, signal?: AbortSignal) {
  return apiClient.get<DashboardResponse>(`/api/dashboard/${teamSlug}`, signal);
}

/* ------------------------------- repositories ------------------------------ */

export function getRepository(id: number, signal?: AbortSignal) {
  return apiClient.get<Repository>(`/api/repositories/${id}`, signal);
}

export function createRepository(input: { teamId: number; owner: string; name: string }) {
  return apiClient.post<Repository>("/api/repositories", input);
}

export function syncRepository(id: number) {
  return apiClient.post<{ ok: true }>(`/api/repositories/${id}/sync`);
}

export function deleteRepository(id: number) {
  return apiClient.delete<void>(`/api/repositories/${id}`);
}

export function updateRepositorySettings(id: number, input: { defaultBranch?: string }) {
  return apiClient.patch<Repository>(`/api/repositories/${id}/settings`, input);
}

/* ------------------------------ pull requests ------------------------------ */

export function getPullRequests(
  repositoryId: number,
  state?: "open" | "closed" | "merged",
  signal?: AbortSignal
) {
  const query = state ? `?state=${state}` : "";
  return apiClient.get<PullRequest[]>(`/api/repositories/${repositoryId}/pull-requests${query}`, signal);
}

export function getPullRequestTimeline(
  repositoryId: number,
  pullRequestId: number,
  signal?: AbortSignal
) {
  return apiClient.get<TimelineEvent[]>(
    `/api/repositories/${repositoryId}/pull-requests/${pullRequestId}/timeline`,
    signal
  );
}

/* ---------------------------------- reviews --------------------------------- */

export function getReviewerLoad(repositoryId: number, signal?: AbortSignal) {
  return apiClient.get<ReviewerLoadEntry[]>(`/api/repositories/${repositoryId}/reviewer-load`, signal);
}

export interface ReciprocityPair {
  personA: string;
  personB: string;
  aReviewedB: number;
  bReviewedA: number;
  gap: number;
}

export function getReciprocityGap(repositoryId: number, signal?: AbortSignal) {
  return apiClient.get<ReciprocityPair[]>(`/api/repositories/${repositoryId}/reciprocity-gap`, signal);
}

/* --------------------------------- insights --------------------------------- */

export interface RepositoryInsights {
  repositoryId: number;
  generatedAt: string;
  activityScore: ActivityScoreResult;
  reviewHealth: {
    medianTimeToFirstReviewHours: number | null;
    approvalRatio: number;
    totalReviewed: number;
    score: number;
  };
  reviewerLoad: ReviewerLoadEntry[];
  mergeWithoutReview: { pullRequestId: number; number: number; title: string; authorLogin: string }[];
  staleRadar: {
    type: "pull_request" | "issue";
    number: number;
    title: string;
    authorLogin: string;
    daysSinceUpdate: number;
  }[];
  reciprocityGap: ReciprocityPair[];
  issueGraveyard: { number: number; title: string; authorLogin: string; ageDays: number }[];
  commitDecay: { authorLogin: string; recentCount: number; earlierCount: number; trend: string }[];
  weekendHeatmap: WeekendHeatmapResult;
  busFactor: {
    busFactor: number;
    contributions: { authorLogin: string; commitCount: number; share: number }[];
  };
}

export function getRepositoryInsights(repositoryId: number, signal?: AbortSignal) {
  return apiClient.get<RepositoryInsights>(`/api/repositories/${repositoryId}/insights`, signal);
}

/* --------------------------------- activity ---------------------------------- */

export interface ActivityFeedEntry {
  pullRequestNumber: number;
  pullRequestTitle: string;
  events: TimelineEvent[];
}

export function getActivityFeed(repositoryId: number, signal?: AbortSignal) {
  return apiClient.get<ActivityFeedEntry[]>(`/api/repositories/${repositoryId}/activity`, signal);
}

/* ---------------------------------- reports ----------------------------------- */

export function createReport(repositoryId: number, format: "csv" | "json") {
  return apiClient.post<{ id: number; filePath: string }>(
    `/api/repositories/${repositoryId}/reports`,
    { format }
  );
}

export function getReportDownloadUrl(filePath: string): string {
  return `${import.meta.env.VITE_API_URL}/api/reports/download?filePath=${encodeURIComponent(filePath)}`;
}

/* ----------------------------------- teams ------------------------------------ */

export function createTeam(name: string) {
  return apiClient.post<Team>("/api/teams", { name });
}

export function getTeam(slug: string, signal?: AbortSignal) {
  return apiClient.get<{ team: Team; members: TeamMember[] }>(`/api/teams/${slug}`, signal);
}

export function addTeamMember(teamId: number, githubId: number, role?: "admin" | "member") {
  return apiClient.post<TeamMember>(`/api/teams/${teamId}/members`, { githubId, role });
}

export function removeTeamMember(teamId: number, userId: number) {
  return apiClient.delete<void>(`/api/teams/${teamId}/members/${userId}`);
}

export function updateTeamSettings(teamId: number, name: string) {
  return apiClient.patch<Team>(`/api/teams/${teamId}/settings`, { name });
}
