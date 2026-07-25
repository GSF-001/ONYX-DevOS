/**
 * ONYX DevOS — Developer Operating System
 * © 2026 GSF-001
 *
 * Proprietary Software.
 * Unauthorized use is strictly prohibited.
 */

// Inspector.tsx — property editor for the currently selected node

import React from "react";
import { useSelectedNode, useWorkflowActions } from "../WorkflowHooks";

export function Inspector() {
  const node = useSelectedNode();
  const { updateNode, removeNode } = useWorkflowActions();

  if (!node) {
    return (
      <div className="wf-panel wf-inspector">
        <div className="wf-panel-title">Inspector</div>
        <div className="wf-inspector-empty">Select a single node to edit its properties.</div>
      </div>
    );
  }

  return (
    <div className="wf-panel wf-inspector">
      <div className="wf-panel-title">Inspector</div>
      <label className="wf-field-label">Title</label>
      <input
        className="wf-input"
        value={node.title}
        onChange={(e) => updateNode(node.id, { title: e.target.value })}
      />
      <label className="wf-field-label">Kind</label>
      <div className="wf-inspector-kind">{node.kind}</div>
      <label className="wf-field-label">Position</label>
      <div className="wf-node-row wf-node-row-small">
        <input
          type="number"
          className="wf-input wf-input-tiny"
          value={Math.round(node.position.x)}
          onChange={(e) => updateNode(node.id, { position: { ...node.position, x: Number(e.target.value) } })}
        />
        <input
          type="number"
          className="wf-input wf-input-tiny"
          value={Math.round(node.position.y)}
          onChange={(e) => updateNode(node.id, { position: { ...node.position, y: Number(e.target.value) } })}
        />
      </div>
      <label className="wf-field-label">
        <input type="checkbox" checked={node.locked} onChange={(e) => updateNode(node.id, { locked: e.target.checked })} />
        {" "}Locked
      </label>
      <label className="wf-field-label">
        <input type="checkbox" checked={node.hidden} onChange={(e) => updateNode(node.id, { hidden: e.target.checked })} />
        {" "}Hidden
      </label>
      <label className="wf-field-label">Config (JSON)</label>
      <textarea
        className="wf-textarea"
        value={JSON.stringify(node.config, null, 2)}
        onChange={(e) => {
          try {
            const parsed = JSON.parse(e.target.value);
            updateNode(node.id, { config: parsed });
          } catch {
            /* ignore invalid JSON until valid */
          }
        }}
      />
      <button className="wf-btn-bevel wf-btn-danger" onClick={() => removeNode(node.id)}>
        Delete Node
      </button>
    </div>
  );
}
