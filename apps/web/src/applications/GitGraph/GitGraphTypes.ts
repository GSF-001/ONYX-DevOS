// GitGraphTypes.ts
// Shared type definitions for the GitGraph application.

export type CommitHash = string;

export interface DiffLine {
  type: "add" | "remove" | "context";
  content: string;
  oldLineNumber: number | null;
  newLineNumber: number | null;
}

export interface FileDiff {
  path: string;
  status: "added" | "modified" | "deleted" | "renamed";
  additions: number;
  deletions: number;
  lines: DiffLine[];
}

export interface GitCommit {
  hash: CommitHash;
  parents: CommitHash[];
  author: string;
  authorEmail: string;
  message: string;
  timestamp: number; // unix seconds
  branch: string; // branch the commit was authored on
  changedFiles: FileDiff[];
}

export interface GitBranch {
  name: string;
  head: CommitHash;
  color: string;
  isRemote: boolean;
  isCurrent: boolean;
}

export interface GitGraphNode {
  commit: GitCommit;
  lane: number;
  row: number;
  x: number;
  y: number;
  color: string;
}

export interface GitGraphEdge {
  id: string;
  from: CommitHash;
  to: CommitHash;
  fromLane: number;
  toLane: number;
  path: string; // SVG path "d" attribute
  color: string;
  isMerge: boolean;
}

export interface GitGraphLayout {
  nodes: GitGraphNode[];
  edges: GitGraphEdge[];
  nodesByHash: Record<CommitHash, GitGraphNode>;
  laneCount: number;
  rowHeight: number;
  laneWidth: number;
  width: number;
  height: number;
}

export interface GitGraphState {
  repositoryName: string;
  commits: GitCommit[];
  branches: GitBranch[];
  selectedCommitHash: CommitHash | null;
  selectedFilePath: string | null;
  filterQuery: string;
  viewport: { panX: number; panY: number; zoom: number };
}

export type CommandResult =
  | { ok: true; message: string }
  | { ok: false; message: string };
