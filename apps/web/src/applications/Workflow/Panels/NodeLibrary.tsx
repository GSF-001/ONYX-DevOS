// NodeLibrary.tsx — draggable palette of node types; drop onto canvas to instantiate

import React from "react";
import { NODE_LIBRARY_ITEMS } from "../Nodes";
import { NODE_COLORS } from "../WorkflowTypes";

export function NodeLibrary() {
  return (
    <div className="wf-panel wf-node-library">
      <div className="wf-panel-title">Node Library</div>
      <div className="wf-library-list">
        {NODE_LIBRARY_ITEMS.map((item) => (
          <div
            key={item.kind}
            className="wf-library-item"
            draggable
            onDragStart={(e) => e.dataTransfer.setData("application/x-workflow-node", item.kind)}
          >
            <span className="wf-library-swatch" style={{ background: NODE_COLORS[item.kind] }} />
            <div className="wf-library-text">
              <div className="wf-library-label">{item.label}</div>
              <div className="wf-library-desc">{item.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
