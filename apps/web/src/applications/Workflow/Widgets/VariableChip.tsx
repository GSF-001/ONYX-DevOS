// VariableChip.tsx — small colored badge representing a variable reference, insertable into expression fields

import React from "react";
import { VariableType } from "../WorkflowTypes";

const TYPE_COLOR: Record<VariableType, string> = {
  string: "#2e6f8b",
  number: "#2e8b57",
  boolean: "#8b6f2e",
  json: "#6f2e8b",
};

interface Props {
  name: string;
  type: VariableType;
  onClick?: () => void;
}

export function VariableChip({ name, type, onClick }: Props) {
  return (
    <span
      className="wf-variable-chip"
      style={{ borderColor: TYPE_COLOR[type], cursor: onClick ? "pointer" : "default" }}
      onClick={onClick}
      title={`${type} variable`}
    >
      <span className="wf-variable-chip-dot" style={{ background: TYPE_COLOR[type] }} />
      {name}
    </span>
  );
}
