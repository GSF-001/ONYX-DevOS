/**
 * ONYX DevOS
 * Copyright (c) 2026 GSF-001
 * All rights reserved.
 */

import { gitGraphStore } from "./GitGraphStore";
import { getGitGraph } from "../../shared/api";
import { getActiveRepositoryId } from "../Dashboard/DashboardStore";
import type { CommandResult, CommitHash } from "./GitGraphTypes";

export async function loadRepository(): Promise<CommandResult> {
  const repositoryId = getActiveRepositoryId();
  if (!repositoryId) {
    return { ok: false, message: "No repository selected." };
  }

  try {
    const { commits, branches } = await getGitGraph(repositoryId);
    gitGraphStore.setState({ commits, branches, selectedCommitHash: null, selectedFilePath: null });
    return { ok: true, message: `Loaded ${commits.length} commits across ${branches.length} branches` };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load repository graph.";
    return { ok: false, message };
  }
}

export function selectCommit(hash: CommitHash): CommandResult {
  const { commits } = gitGraphStore.getState();
  const exists = commits.some((c) => c.hash === hash);
  if (!exists) return { ok: false, message: `Unknown commit ${hash}` };
  gitGraphStore.setState({ selectedCommitHash: hash, selectedFilePath: null });
  return { ok: true, message: `Selected commit ${hash}` };
}

export function clearSelection(): CommandResult {
  gitGraphStore.setState({ selectedCommitHash: null, selectedFilePath: null });
  return { ok: true, message: "Selection cleared" };
}

export function selectFile(path: string): CommandResult {
  gitGraphStore.setState({ selectedFilePath: path });
  return { ok: true, message: `Viewing diff for ${path}` };
}

export function checkoutBranch(name: string): CommandResult {
  const { branches } = gitGraphStore.getState();
  const target = branches.find((b) => b.name === name);
  if (!target) return { ok: false, message: `Branch "${name}" does not exist` };
  if (target.isRemote) {
    return { ok: false, message: `Cannot check out remote branch "${name}" directly` };
  }
  const updated = branches.map((b) => ({ ...b, isCurrent: b.name === name }));
  gitGraphStore.setState({ branches: updated, selectedCommitHash: target.head });
  return { ok: true, message: `Switched to branch "${name}"` };
}

export function createBranch(name: string, fromCommit: CommitHash): CommandResult {
  const { branches, commits } = gitGraphStore.getState();
  if (!name.trim()) return { ok: false, message: "Branch name cannot be empty" };
  if (branches.some((b) => b.name === name)) {
    return { ok: false, message: `Branch "${name}" already exists` };
  }
  const source = commits.find((c) => c.hash === fromCommit);
  if (!source) return { ok: false, message: `Commit ${fromCommit} not found` };

  const palette = ["#e0a458", "#4fb0a5", "#9a7bd1", "#d97a86", "#8fae6b", "#6fa8d1"];
  const color = palette[branches.length % palette.length];

  gitGraphStore.setState({
    branches: [...branches, { name, head: fromCommit, color, isRemote: false, isCurrent: false }],
  });
  return { ok: true, message: `Created branch "${name}" at ${fromCommit}` };
}

export function deleteBranch(name: string): CommandResult {
  const { branches } = gitGraphStore.getState();
  const target = branches.find((b) => b.name === name);
  if (!target) return { ok: false, message: `Branch "${name}" does not exist` };
  if (target.isCurrent) return { ok: false, message: `Cannot delete the checked-out branch "${name}"` };
  gitGraphStore.setState({ branches: branches.filter((b) => b.name !== name) });
  return { ok: true, message: `Deleted branch "${name}"` };
}

export function setFilterQuery(query: string): CommandResult {
  gitGraphStore.setState({ filterQuery: query });
  return { ok: true, message: query ? `Filtering for "${query}"` : "Filter cleared" };
}

export function panViewport(dx: number, dy: number): CommandResult {
  const { viewport } = gitGraphStore.getState();
  gitGraphStore.setState({ viewport: { ...viewport, panX: viewport.panX + dx, panY: viewport.panY + dy } });
  return { ok: true, message: "Viewport panned" };
}

export function setZoom(zoom: number): CommandResult {
  const clamped = Math.min(2, Math.max(0.4, zoom));
  const { viewport } = gitGraphStore.getState();
  gitGraphStore.setState({ viewport: { ...viewport, zoom: clamped } });
  return { ok: true, message: `Zoom set to ${clamped.toFixed(2)}x` };
}

export function resetViewport(): CommandResult {
  gitGraphStore.setState({ viewport: { panX: 0, panY: 0, zoom: 1 } });
  return { ok: true, message: "Viewport reset" };
}
