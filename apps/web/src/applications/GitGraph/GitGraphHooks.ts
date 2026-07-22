// GitGraphHooks.ts
// React bindings on top of GitGraphStore. Uses useSyncExternalStore so the
// UI stays in sync with commands dispatched from GitGraphCommands.ts.

import { useMemo, useSyncExternalStore } from "react";
import { gitGraphStore } from "./GitGraphStore";
import { computeLayout } from "./GitGraphAPI";
import type { GitCommit, GitGraphLayout, GitGraphState } from "./GitGraphTypes";

export function useGitGraphState(): GitGraphState {
  return useSyncExternalStore(gitGraphStore.subscribe, gitGraphStore.getState, gitGraphStore.getState);
}

export function useFilteredCommits(): GitCommit[] {
  const { commits, filterQuery } = useGitGraphState();
  return useMemo(() => {
    if (!filterQuery.trim()) return commits;
    const q = filterQuery.trim().toLowerCase();
    return commits.filter(
      (c) =>
        c.message.toLowerCase().includes(q) ||
        c.author.toLowerCase().includes(q) ||
        c.hash.toLowerCase().includes(q) ||
        c.branch.toLowerCase().includes(q)
    );
  }, [commits, filterQuery]);
}

export function useGitGraphLayout(): GitGraphLayout {
  const commits = useFilteredCommits();
  return useMemo(() => computeLayout(commits), [commits]);
}

export function useSelectedCommit(): GitCommit | null {
  const { commits, selectedCommitHash } = useGitGraphState();
  return useMemo(
    () => commits.find((c) => c.hash === selectedCommitHash) ?? null,
    [commits, selectedCommitHash]
  );
}

export function useSelectedFileDiff() {
  const commit = useSelectedCommit();
  const { selectedFilePath } = useGitGraphState();
  return useMemo(() => {
    if (!commit || !selectedFilePath) return null;
    return commit.changedFiles.find((f) => f.path === selectedFilePath) ?? null;
  }, [commit, selectedFilePath]);
}

export function useCurrentBranch() {
  const { branches } = useGitGraphState();
  return useMemo(() => branches.find((b) => b.isCurrent) ?? null, [branches]);
}
