// Objects/Frame.tsx

import React, { useState } from "react";
import { FrameObject } from "../WhiteboardTypes";

interface FrameProps {
  object: FrameObject;
  selected: boolean;
  onRename: (name: string) => void;
}

export const Frame: React.FC<FrameProps> = ({ object, selected, onRename }) => {
  const [editingName, setEditingName] = useState(false);
  const [draft, setDraft] = useState(object.name);

  return (
    <div className="wb-object wb-frame" style={{ width: "100%", height: "100%", position: "relative" }}>
      <div
        style={{
          position: "absolute",
          top: -22,
          left: 0,
          fontSize: 12,
          color: selected ? "#4d7cfe" : "#8a8f98",
          cursor: "text",
          userSelect: "none",
        }}
        onDoubleClick={() => setEditingName(true)}
      >
        {editingName ? (
          <input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={() => {
              setEditingName(false);
              if (draft.trim()) onRename(draft.trim());
            }}
            onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
            style={{ fontSize: 12, padding: "1px 4px" }}
          />
        ) : (
          object.name
        )}
      </div>
      <div
        style={{
          width: "100%",
          height: "100%",
          background: object.fill,
          border: `1px solid ${selected ? "#4d7cfe" : "#d7dae0"}`,
          borderRadius: 2,
        }}
      />
    </div>
  );
};

export default Frame;
