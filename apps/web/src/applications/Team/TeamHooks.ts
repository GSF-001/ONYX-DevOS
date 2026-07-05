import { useCallback, useEffect, useState } from "react";
import { TeamAPI } from "./TeamAPI";
import { DEFAULT_TEAM_SLUG, getActiveRepositoryId } from "./TeamStore";
import type { TeamViewState } from "./TeamTypes";

export function useTeamData() {
  const [state, setState] = useState<TeamViewState>({
    team: null,
    members: [],
    reviewerLoad: [],
    contributions: [],
    loading: true,
    error: null,
  });

  const load = useCallback(async () => {
    const repositoryId = getActiveRepositoryId();
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const [teamResult, reviewerLoad, contributions] = await Promise.all([
        TeamAPI.getTeam(DEFAULT_TEAM_SLUG),
        repositoryId ? TeamAPI.getReviewerLoad(repositoryId) : Promise.resolve([]),
        repositoryId ? TeamAPI.getContributions(repositoryId) : Promise.resolve([]),
      ]);

      setState({
        team: teamResult.team,
        members: teamResult.members,
        reviewerLoad,
        contributions,
        loading: false,
        error: null,
      });
    } catch (err) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : "Failed to load team data.",
      }));
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return { ...state, reload: load };
}
