// Console.tsx — scrolling execution log with level filtering

import React, { useMemo, useState } from "react";
import { useConsole, useWorkflowActions } from "../WorkflowHooks";
import { ConsoleEntry } from "../WorkflowTypes";

const LEVEL_COLOR: Record<ConsoleEntry["level"], string> = {
  info: "#2e6f8b",
  warn: "#8b6f2e",
  error: "#8b2e2e",
  debug: "#5a5a5a",
};

export function Console() {
  const entries = useConsole();
  const { clearConsole } = useWorkflowActions();
  const [filter, setFilter] = useState<ConsoleEntry["level"] | "all">("all");

  const visible = useMemo(
    () => (filter === "all" ? entries : entries.filter((e) => e.level === filter)),
    [entries, filter]
  );

  return (
    <div className="wf-panel wf-console">
      <div className="wf-panel-title">
        Console
        <div className="wf-console-controls">
          <select className="wf-select" value={filter} onChange={(e) => setFilter(e.target.value as any)}>
            <option value="all">all</option>
            <option value="info">info</option>
            <option value="warn">warn</option>
            <option value="error">error</option>
            <option value="debug">debug</option>
          </select>
          <button className="wf-btn-bevel wf-btn-tiny" onClick={clearConsole}>
            Clear
          </button>
        </div>
      </div>
      <div className="wf-console-log">
        {visible.map((e) => (
          <div key={e.id} className="wf-console-entry">
            <span className="wf-console-time">{new Date(e.timestamp).toLocaleTimeString()}</span>
            <span className="wf-console-level" style={{ color: LEVEL_COLOR[e.level] }}>
              [{e.level}]
            </span>
            <span className="wf-console-message">{e.message}</span>
          </div>
        ))}
        {visible.length === 0 && <div className="wf-inspector-empty">No log entries.</div>}
      </div>
    </div>
  );
}
