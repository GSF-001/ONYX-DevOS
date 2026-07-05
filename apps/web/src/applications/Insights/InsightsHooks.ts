import { useCallback, useEffect, useState } from "react";
import { InsightsAPI } from "./InsightsAPI";
import { getActiveRepositoryId } from "./InsightsStore";
import type { InsightsViewState } from "./InsightsTypes";

export function useInsightsData() {
  const [state, setState] = useState<InsightsViewState>({ insights: null, loading: true, error: null });

  const load = useCallback(async () => {
    const repositoryId = getActiveRepositoryId();
    if (!repositoryId) {
      setState({ insights: null, loading: false, error: "No repository selected." });
      return;
    }
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const insights = await InsightsAPI.getRepositoryInsights(repositoryId);
      setState({ insights, loading: false, error: null });
    } catch (err) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : "Failed to load insights.",
      }));
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return { ...state, reload: load };
}
