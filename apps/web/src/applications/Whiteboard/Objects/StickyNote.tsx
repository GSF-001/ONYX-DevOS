/**
 * ONYX DevOS — Developer Operating System
 * © 2026 GSF-001
 *
 * Proprietary Software.
 * Unauthorized use is strictly prohibited.
 */

// Objects/StickyNote.tsx

import React, { useState } from "react";
import { StickyNoteObject } from "../WhiteboardTypes";

interface StickyNoteProps {
  object: StickyNoteObject;
  selected: boolean;
  onChange: (patch: Partial<StickyNoteObject>) => void;
  onCommit: () => void;
}

export const StickyNote: React.FC<StickyNoteProps> = ({ object, selected, onChange, onCommit }) => {
  const [editing, setEditing] = useState(false);

  return (
    <div
      className="wb-object wb-sticky"
      onDoubleClick={() => setEditing(true)}
      style={{
        width: "100%",
        height: "100%",
        background: object.color,
        boxShadow: selected ? "0 2px 10px rgba(0,0,0,0.18)" : "0 1px 4px rgba(0,0,0,0.12)",
        borderRadius: 4,
        padding: 12,
        boxSizing: "border-box",
        display: "flex",
        overflow: "hidden",
      }}
    >
      {editing ? (
        <textarea
          autoFocus
          value={object.text}
          onChange={(e) => onChange({ text: e.target.value })}
          onBlur={() => {
            setEditing(false);
            onCommit();
          }}
          style={{
            width: "100%",
            height: "100%",
            border: "none",
            background: "transparent",
            resize: "none",
            outline: "none",
            fontSize: object.fontSize,
            fontFamily: "inherit",
            lineHeight: 1.35,
          }}
        />
      ) : (
        <div
          style={{
            fontSize: object.fontSize,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            lineHeight: 1.35,
          }}
        >
          {object.text || "Double click to edit"}
        </div>
      )}
    </div>
  );
};

export default StickyNote;
