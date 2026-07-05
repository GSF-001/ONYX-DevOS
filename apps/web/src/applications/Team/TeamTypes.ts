import type { ReviewerLoadEntry, Team, TeamMember } from "../../shared/types";
import type { RepositoryInsights } from "../../shared/api/endpoints";

export interface TeamViewState {
  team: Team | null;
  members: TeamMember[];
  reviewerLoad: ReviewerLoadEntry[];
  contributions: RepositoryInsights["busFactor"]["contributions"];
  loading: boolean;
  error: string | null;
}

export type { Team, TeamMember, ReviewerLoadEntry };
