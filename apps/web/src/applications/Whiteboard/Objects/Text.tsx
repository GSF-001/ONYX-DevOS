/**
 * ONYX DevOS — Developer Operating System
 * © 2026 GSF-001
 *
 * Proprietary Software.
 * Unauthorized use is strictly prohibited.
 */

// Objects/Text.tsx

import React, { useState } from "react";
import { TextObject } from "../WhiteboardTypes";

interface TextProps {
  object: TextObject;
  selected: boolean;
  onChange: (patch: Partial<TextObject>) => void;
  onCommit: () => void;
}

export const Text: React.FC<TextProps> = ({ object, selected, onChange, onCommit }) => {
  const [editing, setEditing] = useState(false);

  const sharedStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    fontSize: object.fontSize,
    fontFamily: object.fontFamily,
    color: object.color,
    textAlign: object.align,
    fontWeight: object.bold ? 700 : 400,
    fontStyle: object.italic ? "italic" : "normal",
    lineHeight: 1.3,
  };

  return (
    <div
      className="wb-object wb-text"
      onDoubleClick={() => setEditing(true)}
      style={{
        outline: selected ? "1px solid #4d7cfe" : "none",
        outlineOffset: 2,
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
            ...sharedStyle,
            border: "none",
            outline: "none",
            resize: "none",
            background: "transparent",
          }}
        />
      ) : (
        <div style={{ ...sharedStyle, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
          {object.text || "Text"}
        </div>
      )}
    </div>
  );
};

export default Text;
