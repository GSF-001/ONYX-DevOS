import { useCallback, useEffect, useState } from "react";
import { CommunityAPI } from "./CommunityAPI";
import type { CommunityViewState } from "./CommunityTypes";

export function useCommunityFeed() {
  const [state, setState] = useState<CommunityViewState>({ feed: [], loading: true, error: null });

  const load = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const feed = await CommunityAPI.getFeed();
      setState({ feed, loading: false, error: null });
    } catch (err) {
      setState((prev) => ({ ...prev, loading: false, error: err instanceof Error ? err.message : "Failed to load feed." }));
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return { ...state, reload: load };
}

export function useCommunityList(fetcher: () => Promise<any[]>) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetcher()
      .then((data) => !cancelled && setItems(data))
      .catch((err) => !cancelled && setError(err instanceof Error ? err.message : "Failed to load."))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { items, loading, error };
}
