// Variables.tsx — CRUD list of workflow-scoped variables

import React, { useState } from "react";
import { useVariables, useWorkflowActions } from "../WorkflowHooks";
import { VariableChip } from "../Widgets/VariableChip";

export function Variables() {
  const variables = useVariables();
  const { setVariable, removeVariable } = useWorkflowActions();
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [type, setType] = useState<"string" | "number" | "boolean" | "json">("string");

  const create = () => {
    if (!name.trim()) return;
    setVariable(name.trim(), value, type);
    setName("");
    setValue("");
  };

  return (
    <div className="wf-panel wf-variables">
      <div className="wf-panel-title">Variables</div>
      <div className="wf-variables-list">
        {variables.map((v) => (
          <div key={v.id} className="wf-variable-row">
            <VariableChip name={v.name} type={v.type} />
            <span className="wf-variable-value">{String(v.value)}</span>
            <button className="wf-btn-bevel wf-btn-tiny" onClick={() => removeVariable(v.id)}>
              ×
            </button>
          </div>
        ))}
        {variables.length === 0 && <div className="wf-inspector-empty">No variables yet.</div>}
      </div>
      <div className="wf-variables-create">
        <input className="wf-input" placeholder="name" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="wf-input" placeholder="value" value={value} onChange={(e) => setValue(e.target.value)} />
        <select className="wf-select" value={type} onChange={(e) => setType(e.target.value as any)}>
          <option value="string">string</option>
          <option value="number">number</option>
          <option value="boolean">boolean</option>
          <option value="json">json</option>
        </select>
        <button className="wf-btn-bevel" onClick={create}>
          Add
        </button>
      </div>
    </div>
  );
}
