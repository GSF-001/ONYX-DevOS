// CommitNode.tsx
import { useState } from "react";
import type { GitGraphNode } from "./GitGraphTypes";
import { shortHash } from "./GitGraphAPI";

interface CommitNodeProps {
  node: GitGraphNode;
  isSelected: boolean;
  isHead: boolean;
  onSelect: (hash: string) => void;
}

export default function CommitNode({ node, isSelected, isHead, onSelect }: CommitNodeProps) {
  const [hovered, setHovered] = useState(false);
  const radius = isSelected ? 7 : 5.5;

  return (
    <g
      className="git-commit-node"
      transform={`translate(${node.x}, ${node.y})`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onSelect(node.commit.hash)}
      role="button"
      tabIndex={0}
      aria-label={`Commit ${shortHash(node.commit.hash)}: ${node.commit.message}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onSelect(node.commit.hash);
      }}
    >
      {isSelected && <circle r={radius + 5} className="git-commit-node-halo" fill={node.color} opacity={0.18} />}
      <circle
        r={radius}
        fill={node.commit.parents.length > 1 ? "var(--gg-bg-surface)" : node.color}
        stroke={node.color}
        strokeWidth={node.commit.parents.length > 1 ? 2.5 : 0}
        className="git-commit-node-dot"
      />
      {isHead && (
        <text x={0} y={-radius - 8} textAnchor="middle" className="git-commit-node-head-badge">
          HEAD
        </text>
      )}
      {hovered && (
        <foreignObject x={16} y={-14} width={260} height={54} className="git-commit-node-tooltip-anchor">
          <div className="git-commit-node-tooltip">
            <div className="git-commit-node-tooltip-message">{node.commit.message}</div>
            <div className="git-commit-node-tooltip-meta">
              <span className="git-mono">{shortHash(node.commit.hash)}</span> · {node.commit.author}
            </div>
          </div>
        </foreignObject>
      )}
    </g>
  );
}
