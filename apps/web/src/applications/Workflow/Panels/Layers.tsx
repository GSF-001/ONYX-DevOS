// Layers.tsx — z-order list of nodes with visibility/lock toggles and reordering

import React from "react";
import { useNodes, useWorkflowActions, useWorkflowState } from "../WorkflowHooks";
import { NODE_COLORS } from "../WorkflowTypes";

export function Layers() {
  const nodes = useNodes();
  const state = useWorkflowState();
  const { updateNode, selectNodes, bringToFront } = useWorkflowActions();

  const sorted = [...nodes].sort((a, b) => b.zIndex - a.zIndex);

  return (
    <div className="wf-panel wf-layers">
      <div className="wf-panel-title">Layers</div>
      <div className="wf-layers-list">
        {sorted.map((n) => (
          <div
            key={n.id}
            className={`wf-layer-row ${state.selectedNodeIds.includes(n.id) ? "wf-layer-row-selected" : ""}`}
            onClick={() => selectNodes([n.id])}
          >
            <span className="wf-library-swatch" style={{ background: NODE_COLORS[n.kind] }} />
            <span className="wf-layer-title">{n.title}</span>
            <button
              className="wf-btn-bevel wf-btn-tiny"
              onClick={(e) => {
                e.stopPropagation();
                updateNode(n.id, { hidden: !n.hidden });
              }}
              title="Toggle visibility"
            >
              {n.hidden ? "🚫" : "👁"}
            </button>
            <button
              className="wf-btn-bevel wf-btn-tiny"
              onClick={(e) => {
                e.stopPropagation();
                updateNode(n.id, { locked: !n.locked });
              }}
              title="Toggle lock"
            >
              {n.locked ? "🔒" : "🔓"}
            </button>
            <button
              className="wf-btn-bevel wf-btn-tiny"
              onClick={(e) => {
                e.stopPropagation();
                bringToFront(n.id);
              }}
              title="Bring to front"
            >
              ⬆
            </button>
          </div>
        ))}
        {sorted.length === 0 && <div className="wf-inspector-empty">No nodes on canvas.</div>}
      </div>
    </div>
  );
}
