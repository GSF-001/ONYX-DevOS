import { useCallback, useEffect, useState } from "react";
import { HeatmapAPI } from "./HeatmapAPI";
import { getActiveRepositoryId } from "./HeatmapStore";
import type { HeatmapViewState } from "./HeatmapTypes";

export function useHeatmapData() {
  const [state, setState] = useState<HeatmapViewState>({ data: null, loading: true, error: null });

  const load = useCallback(async () => {
    const repositoryId = getActiveRepositoryId();
    if (!repositoryId) {
      setState({ data: null, loading: false, error: "No repository selected." });
      return;
    }
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const data = await HeatmapAPI.getCommitHeatmap(repositoryId);
      setState({ data, loading: false, error: null });
    } catch (err) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : "Failed to load heatmap.",
      }));
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return { ...state, reload: load };
}
