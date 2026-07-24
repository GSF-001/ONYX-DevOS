/**
 * Generic optimistic-update helper.
 *
 * Many callers (routes/workflow) update local/cached state immediately
 * for responsiveness, then confirm against the GitHub API. If the
 * remote call fails, the local mutation must be rolled back so state
 * doesn't drift from GitHub's source of truth.
 */
export interface OptimisticUpdateParams<TLocal, TRemote> {
  /** Apply the optimistic local mutation, returning enough state to undo it */
  applyLocal: () => TLocal | Promise<TLocal>;
  /** Perform the real GitHub write */
  applyRemote: () => Promise<TRemote>;
  /** Undo the local mutation using the snapshot returned by applyLocal */
  rollbackLocal: (localSnapshot: TLocal) => void | Promise<void>;
}

export async function withOptimisticUpdate<TLocal, TRemote>(
  params: OptimisticUpdateParams<TLocal, TRemote>
): Promise<TRemote> {
  const { applyLocal, applyRemote, rollbackLocal } = params;

  const localSnapshot = await applyLocal();

  try {
    return await applyRemote();
  } catch (err) {
    try {
      await rollbackLocal(localSnapshot);
    } catch (rollbackErr) {
      // eslint-disable-next-line no-console
      console.error("[optimisticUpdate] rollback failed after remote error:", rollbackErr);
    }
    throw err;
  }
}
