// GitGraphAPI.ts
// Pure functions: graph layout algorithm, line-diff algorithm, and the
// sample repository used to seed the app (no live git backend in this
// environment, so the "repository" is an in-memory commit DAG).

import type {
  CommitHash,
  DiffLine,
  FileDiff,
  GitBranch,
  GitCommit,
  GitGraphEdge,
  GitGraphLayout,
  GitGraphNode,
} from "./GitGraphTypes";

export const LANE_COLORS = [
  "#e0a458", // amber
  "#4fb0a5", // teal
  "#9a7bd1", // violet
  "#d97a86", // rose
  "#8fae6b", // sage
  "#6fa8d1", // sky
];

export function laneColor(lane: number): string {
  return LANE_COLORS[lane % LANE_COLORS.length];
}

/**
 * Assigns each commit to a lane and produces render coordinates + edges.
 * Commits must already be sorted newest -> oldest (matches `git log` order).
 * Algorithm: maintain a list of "open lanes", where lanes[i] holds the hash
 * a lane is currently waiting to encounter (i.e. that lane's next commit).
 * When we reach a commit that a lane is waiting for, it continues in that
 * lane and is redirected toward the commit's first parent. Extra parents
 * (merges) open/continue additional lanes.
 */
export function computeLayout(
  commits: GitCommit[],
  rowHeight = 64,
  laneWidth = 36
): GitGraphLayout {
  const lanes: (CommitHash | null)[] = [];
  const nodes: GitGraphNode[] = [];
  const nodesByHash: Record<CommitHash, GitGraphNode> = {};
  const commitByHash = new Map(commits.map((c) => [c.hash, c]));

  commits.forEach((commit, row) => {
    // Find a lane already waiting for this commit.
    let laneIndex = lanes.findIndex((waiting) => waiting === commit.hash);
    if (laneIndex === -1) {
      // No lane was expecting this commit (it starts a new branch tip).
      laneIndex = lanes.findIndex((waiting) => waiting === null);
      if (laneIndex === -1) {
        laneIndex = lanes.length;
        lanes.push(null);
      }
    }

    const node: GitGraphNode = {
      commit,
      lane: laneIndex,
      row,
      x: laneIndex * laneWidth + laneWidth / 2,
      y: row * rowHeight + rowHeight / 2,
      color: laneColor(laneIndex),
    };
    nodes.push(node);
    nodesByHash[commit.hash] = node;

    const [firstParent, ...restParents] = commit.parents;

    // This lane now continues toward the first parent (or closes if root).
    lanes[laneIndex] = firstParent ?? null;

    // Extra parents (merge commits) need their own lane, unless a lane is
    // already tracking that parent.
    for (const parent of restParents) {
      if (!commitByHash.has(parent)) continue;
      const alreadyTracked = lanes.some((w) => w === parent);
      if (alreadyTracked) continue;
      const freeIndex = lanes.findIndex((w) => w === null);
      if (freeIndex === -1) {
        lanes.push(parent);
      } else {
        lanes[freeIndex] = parent;
      }
    }
  });

  const edges: GitGraphEdge[] = [];
  for (const commit of commits) {
    const fromNode = nodesByHash[commit.hash];
    commit.parents.forEach((parentHash) => {
      const toNode = nodesByHash[parentHash];
      if (!fromNode || !toNode) return;
      edges.push({
        id: `${commit.hash}->${parentHash}`,
        from: commit.hash,
        to: parentHash,
        fromLane: fromNode.lane,
        toLane: toNode.lane,
        path: buildEdgePath(fromNode, toNode, rowHeight),
        color: laneColor(toNode.lane === fromNode.lane ? fromNode.lane : toNode.lane),
        isMerge: commit.parents.length > 1,
      });
    });
  }

  const laneCount = lanes.length || 1;
  return {
    nodes,
    edges,
    nodesByHash,
    laneCount,
    rowHeight,
    laneWidth,
    width: laneCount * laneWidth + laneWidth,
    height: commits.length * rowHeight + rowHeight,
  };
}

function buildEdgePath(
  from: GitGraphNode,
  to: GitGraphNode,
  rowHeight: number
): string {
  if (from.lane === to.lane) {
    return `M ${from.x} ${from.y} L ${to.x} ${to.y}`;
  }
  // Curve out of the source lane and into the destination lane, bending
  // roughly halfway between the two rows so parallel edges don't overlap.
  const bendY = from.y + rowHeight * 0.6;
  return `M ${from.x} ${from.y} C ${from.x} ${bendY}, ${to.x} ${bendY}, ${to.x} ${to.y}`;
}

/**
 * Classic O(n*m) LCS-based line diff. Small inputs only (this is a demo
 * repository, not a real diff engine for large files), but the algorithm
 * itself is a real implementation, not a stub.
 */
export function computeDiff(
  path: string,
  oldLines: string[],
  newLines: string[],
  status: FileDiff["status"] = "modified"
): FileDiff {
  const n = oldLines.length;
  const m = newLines.length;
  const lcs: number[][] = Array.from({ length: n + 1 }, () =>
    new Array(m + 1).fill(0)
  );

  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      lcs[i][j] =
        oldLines[i] === newLines[j]
          ? lcs[i + 1][j + 1] + 1
          : Math.max(lcs[i + 1][j], lcs[i][j + 1]);
    }
  }

  const lines: DiffLine[] = [];
  let i = 0;
  let j = 0;
  let oldLineNumber = 1;
  let newLineNumber = 1;
  let additions = 0;
  let deletions = 0;

  while (i < n && j < m) {
    if (oldLines[i] === newLines[j]) {
      lines.push({
        type: "context",
        content: oldLines[i],
        oldLineNumber: oldLineNumber++,
        newLineNumber: newLineNumber++,
      });
      i++;
      j++;
    } else if (lcs[i + 1][j] >= lcs[i][j + 1]) {
      lines.push({
        type: "remove",
        content: oldLines[i],
        oldLineNumber: oldLineNumber++,
        newLineNumber: null,
      });
      deletions++;
      i++;
    } else {
      lines.push({
        type: "add",
        content: newLines[j],
        oldLineNumber: null,
        newLineNumber: newLineNumber++,
      });
      additions++;
      j++;
    }
  }
  while (i < n) {
    lines.push({
      type: "remove",
      content: oldLines[i],
      oldLineNumber: oldLineNumber++,
      newLineNumber: null,
    });
    deletions++;
    i++;
  }
  while (j < m) {
    lines.push({
      type: "add",
      content: newLines[j],
      oldLineNumber: null,
      newLineNumber: newLineNumber++,
    });
    additions++;
    j++;
  }

  return { path, status, additions, deletions, lines };
}

function commit(
  hash: CommitHash,
  parents: CommitHash[],
  author: string,
  authorEmail: string,
  message: string,
  timestamp: number,
  branch: string,
  changedFiles: FileDiff[] = []
): GitCommit {
  return { hash, parents, author, authorEmail, message, timestamp, branch, changedFiles };
}

/**
 * Builds a small, realistic repository: a main line, a develop line, a
 * feature branch that gets merged, and a hotfix branched off main.
 * File contents are real strings run through computeDiff, so the diffs
 * rendered in the inspector are genuine LCS diffs, not canned data.
 */
export function generateSampleRepository(): {
  commits: GitCommit[];
  branches: GitBranch[];
} {
  const day = 86400;
  const t0 = 1753142400; // 2025-07-22 00:00:00 UTC, arbitrary anchor

  const readmeV1 = ["# onyx-shell", "", "Desktop shell prototype."];
  const readmeV2 = [
    "# onyx-shell",
    "",
    "Desktop shell prototype.",
    "",
    "## Modules",
    "- window manager",
  ];
  const readmeV3 = [
    "# onyx-shell",
    "",
    "Desktop shell prototype.",
    "",
    "## Modules",
    "- window manager",
    "- git graph viewer",
  ];

  const authApiV1 = ["export function login() {", "  throw new Error('todo');", "}"];
  const authApiV2 = [
    "export function login(user, pass) {",
    "  if (!user || !pass) throw new Error('missing credentials');",
    "  return session.create(user);",
    "}",
    "",
    "export function logout(session) {",
    "  session.destroy();",
    "}",
  ];

  const commits: GitCommit[] = [
    commit("a1c9e02", [], "Sri Wulandari", "sri@onyx.dev", "Initial commit", t0, "main", [
      computeDiff("README.md", [], readmeV1, "added"),
    ]),
    commit(
      "b47f1d8",
      ["a1c9e02"],
      "Sri Wulandari",
      "sri@onyx.dev",
      "docs: document module layout",
      t0 + day,
      "main",
      [computeDiff("README.md", readmeV1, readmeV2)]
    ),
    commit(
      "c88a3ef",
      ["b47f1d8"],
      "Bagas Prakoso",
      "bagas@onyx.dev",
      "chore: branch develop off main",
      t0 + day * 2,
      "develop"
    ),
    commit(
      "d5e4c11",
      ["c88a3ef"],
      "Bagas Prakoso",
      "bagas@onyx.dev",
      "feat: scaffold auth module",
      t0 + day * 3,
      "feature/auth",
      [computeDiff("src/auth/api.ts", [], authApiV1, "added")]
    ),
    commit(
      "e9b02aa",
      ["d5e4c11"],
      "Nadia Kusuma",
      "nadia@onyx.dev",
      "feat: implement login and logout",
      t0 + day * 4,
      "feature/auth",
      [computeDiff("src/auth/api.ts", authApiV1, authApiV2)]
    ),
    commit(
      "f10d7bc",
      ["c88a3ef"],
      "Bagas Prakoso",
      "bagas@onyx.dev",
      "feat: window snapping",
      t0 + day * 4,
      "develop",
      [
        computeDiff(
          "src/wm/snap.ts",
          [],
          ["export function snap(win, edge) {", "  win.dock(edge);", "}"],
          "added"
        ),
      ]
    ),
    commit(
      "12ff3aa",
      ["f10d7bc", "e9b02aa"],
      "Nadia Kusuma",
      "nadia@onyx.dev",
      "merge: bring feature/auth into develop",
      t0 + day * 5,
      "develop"
    ),
    commit(
      "2a7c9db",
      ["b47f1d8"],
      "Rangga Saputra",
      "rangga@onyx.dev",
      "fix: crash on window close (hotfix)",
      t0 + day * 5,
      "hotfix/window-close",
      [
        computeDiff(
          "src/wm/window.ts",
          ["export function close(win) {", "  win.destroy();", "}"],
          [
            "export function close(win) {",
            "  if (!win) return;",
            "  win.destroy();",
            "}",
          ]
        ),
      ]
    ),
    commit(
      "3bd81ec",
      ["b47f1d8", "2a7c9db"],
      "Rangga Saputra",
      "rangga@onyx.dev",
      "merge: hotfix/window-close into main",
      t0 + day * 6,
      "main"
    ),
    commit(
      "44f0a19",
      ["12ff3aa"],
      "Nadia Kusuma",
      "nadia@onyx.dev",
      "feat: add GitGraph application shell",
      t0 + day * 7,
      "develop",
      [computeDiff("README.md", readmeV2, readmeV3)]
    ),
    commit(
      "512cbe4",
      ["3bd81ec", "44f0a19"],
      "Sri Wulandari",
      "sri@onyx.dev",
      "merge: develop into main for release",
      t0 + day * 8,
      "main"
    ),
  ];

  const branches: GitBranch[] = [
    { name: "main", head: "512cbe4", color: laneColor(0), isRemote: false, isCurrent: true },
    { name: "develop", head: "44f0a19", color: laneColor(1), isRemote: false, isCurrent: false },
    {
      name: "feature/auth",
      head: "e9b02aa",
      color: laneColor(2),
      isRemote: false,
      isCurrent: false,
    },
    {
      name: "hotfix/window-close",
      head: "2a7c9db",
      color: laneColor(3),
      isRemote: false,
      isCurrent: false,
    },
    { name: "origin/main", head: "3bd81ec", color: laneColor(0), isRemote: true, isCurrent: false },
  ];

  // Newest first, matching `git log` order (required by computeLayout).
  commits.sort((a, b) => b.timestamp - a.timestamp);

  return { commits, branches };
}

export function shortHash(hash: CommitHash, length = 7): string {
  return hash.slice(0, length);
}

export function formatTimestamp(unixSeconds: number): string {
  const d = new Date(unixSeconds * 1000);
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
