// RepositoryTopology.tsx
// The main graph canvas. Renders BranchLane edges beneath CommitNode dots,
// and supports click-drag panning plus wheel zoom, backed by the store's
// viewport state so MiniMap can stay in sync.

import { useCallback, useRef, useState } from "react";
import BranchLane from "./BranchLane";
import CommitNode from "./CommitNode";
import { useGitGraphLayout, useGitGraphState } from "./GitGraphHooks";
import { selectCommit, panViewport, setZoom } from "./GitGraphCommands";

export default function RepositoryTopology() {
  const layout = useGitGraphLayout();
  const { selectedCommitHash, viewport, branches } = useGitGraphState();
  const svgRef = useRef<SVGSVGElement | null>(null);
  const dragState = useRef<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const headHashes = new Set(branches.map((b) => b.head));

  const handlePointerDown = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    dragState.current = { x: e.clientX, y: e.clientY };
    setIsDragging(true);
    (e.target as Element).setPointerCapture?.(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    if (!dragState.current) return;
    const dx = e.clientX - dragState.current.x;
    const dy = e.clientY - dragState.current.y;
    dragState.current = { x: e.clientX, y: e.clientY };
    panViewport(dx, dy);
  }, []);

  const handlePointerUp = useCallback(() => {
    dragState.current = null;
    setIsDragging(false);
  }, []);

  const handleWheel = useCallback(
    (e: React.WheelEvent<SVGSVGElement>) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setZoom(viewport.zoom + delta);
    },
    [viewport.zoom]
  );

  return (
    <div className="repository-topology-wrapper">
      <svg
        ref={svgRef}
        className={isDragging ? "repository-topology-svg dragging" : "repository-topology-svg"}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onWheel={handleWheel}
        role="img"
        aria-label="Repository commit topology"
      >
        <g transform={`translate(${viewport.panX}, ${viewport.panY}) scale(${viewport.zoom})`}>
          <g className="repository-topology-lanes">
            {layout.edges.map((edge) => (
              <BranchLane key={edge.id} edge={edge} />
            ))}
          </g>
          <g className="repository-topology-nodes">
            {layout.nodes.map((node) => (
              <CommitNode
                key={node.commit.hash}
                node={node}
                isSelected={node.commit.hash === selectedCommitHash}
                isHead={headHashes.has(node.commit.hash)}
                onSelect={(hash) => selectCommit(hash)}
              />
            ))}
          </g>
        </g>
      </svg>
      {layout.nodes.length === 0 && (
        <div className="repository-topology-empty">No commits match the current filter.</div>
      )}
    </div>
  );
}
