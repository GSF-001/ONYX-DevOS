import { useCallback, useEffect, useState } from "react";
import { ActivityAPI } from "./ActivityAPI";
import { getActiveRepositoryId } from "./ActivityStore";
import type { ActivityViewState } from "./ActivityTypes";
import { useSocketEvent } from "../../shared/hooks";

export function useActivityData() {
  const [state, setState] = useState<ActivityViewState>({ history: [], loading: true, error: null });

  const load = useCallback(async () => {
    const repositoryId = getActiveRepositoryId();
    if (!repositoryId) {
      setState({ history: [], loading: false, error: "No repository selected." });
      return;
    }
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const history = await ActivityAPI.getActivityFeed(repositoryId);
      setState({ history, loading: false, error: null });
    } catch (err) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : "Failed to load activity.",
      }));
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useSocketEvent("pull_request.updated", () => void load());
  useSocketEvent("review.created", () => void load());

  return { ...state, reload: load };
}
