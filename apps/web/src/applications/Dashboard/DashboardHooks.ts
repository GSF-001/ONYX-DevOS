import { useCallback, useEffect, useState } from "react";
import { DashboardAPI } from "./DashboardAPI";
import { getActiveRepositoryId, setActiveRepositoryId } from "./DashboardStore";
import type { DashboardViewState } from "./DashboardTypes";
import { useSocketEvent } from "../../shared/hooks";
import { getRepositoryInsights } from "../../shared/api";
import type { RepositoryInsights } from "../../shared/api/endpoints";

export function useDashboardData() {
  const [state, setState] = useState<DashboardViewState & { insights: RepositoryInsights | null }>({
    repositories: [],
    scores: [],
    selectedRepositoryId: getActiveRepositoryId(),
    trend: [],
    activity: [],
    insights: null,
    loading: true,
    error: null,
  });

  const load = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const dashboard = await DashboardAPI.getDashboard("demo-team");
      const selected = getActiveRepositoryId() ?? dashboard.repositories[0]?.id ?? null;
      if (selected) setActiveRepositoryId(selected);

      const [trend, activity, insights] = selected
        ? await Promise.all([
            DashboardAPI.getPrTrend(selected),
            DashboardAPI.getActivity(selected),
            getRepositoryInsights(selected),
          ])
        : [[], [], null];

      setState({
        repositories: dashboard.repositories,
        scores: dashboard.scores,
        selectedRepositoryId: selected,
        trend,
        activity,
        insights,
        loading: false,
        error: null,
      });
    } catch (err) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : "Failed to load dashboard.",
      }));
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useSocketEvent("pull_request.updated", () => void load());
  useSocketEvent("review.created", () => void load());

  const selectRepository = useCallback(
    (id: number) => {
      setActiveRepositoryId(id);
      void load();
    },
    [load]
  );

  return { ...state, reload: load, selectRepository };
}
