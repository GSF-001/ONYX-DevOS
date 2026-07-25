/**
 * ONYX DevOS — Developer Operating System
 * © 2026 GSF-001
 *
 * Proprietary Software.
 * Unauthorized use is strictly prohibited.
 */

// Search.tsx — filters nodes by title/kind and centers the camera on the chosen result

import React, { useMemo, useState } from "react";
import { useNodes, useWorkflowActions } from "../WorkflowHooks";
import { NODE_COLORS } from "../WorkflowTypes";

export function Search() {
  const nodes = useNodes();
  const { selectNodes, setCamera } = useWorkflowActions();
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return nodes.filter((n) => n.title.toLowerCase().includes(q) || n.kind.includes(q)).slice(0, 25);
  }, [nodes, query]);

  const jumpTo = (nodeId: string) => {
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return;
    selectNodes([nodeId]);
    setCamera({ x: -node.position.x + 400, y: -node.position.y + 250 });
  };

  return (
    <div className="wf-panel wf-search">
      <div className="wf-panel-title">Search</div>
      <input
        className="wf-input"
        placeholder="Search nodes..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="wf-search-results">
        {results.map((n) => (
          <div key={n.id} className="wf-search-result" onClick={() => jumpTo(n.id)}>
            <span className="wf-library-swatch" style={{ background: NODE_COLORS[n.kind] }} />
            <span>{n.title}</span>
            <span className="wf-search-kind">{n.kind}</span>
          </div>
        ))}
        {query && results.length === 0 && <div className="wf-inspector-empty">No matches.</div>}
      </div>
    </div>
  );
}
