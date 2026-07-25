/**
 * ONYX DevOS — Developer Operating System
 * © 2026 GSF-001
 *
 * Proprietary Software.
 * Unauthorized use is strictly prohibited.
 */

// Widgets/ObjectThumbnail.tsx

import React from "react";
import { WhiteboardObject } from "../WhiteboardTypes";

interface ObjectThumbnailProps {
  object: WhiteboardObject;
  size?: number;
}

function getThumbnailVisual(obj: WhiteboardObject): React.ReactNode {
  switch (obj.type) {
    case "sticky":
      return <div style={{ width: "100%", height: "100%", background: obj.color, borderRadius: 2 }} />;
    case "rectangle":
      return (
        <div
          style={{
            width: "100%",
            height: "100%",
            background: obj.fill,
            border: `1px solid ${obj.stroke}`,
            borderRadius: Math.min(obj.cornerRadius, 4),
          }}
        />
      );
    case "ellipse":
      return (
        <div
          style={{
            width: "100%",
            height: "100%",
            background: obj.fill,
            border: `1px solid ${obj.stroke}`,
            borderRadius: "50%",
          }}
        />
      );
    case "text":
      return (
        <div style={{ fontSize: 9, color: obj.color, overflow: "hidden", whiteSpace: "nowrap" }}>
          {obj.text || "Text"}
        </div>
      );
    case "frame":
      return <div style={{ width: "100%", height: "100%", border: "1px solid #9aa0ac", borderRadius: 1 }} />;
    case "image":
      return (
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "#e9ecef",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 9,
          }}
        >
          🖼
        </div>
      );
    case "icon":
      return (
        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 10, height: 10, background: obj.color, borderRadius: "50%" }} />
        </div>
      );
    case "video":
      return (
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "#1c1f26",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 9,
            color: "#ffffff",
          }}
        >
          ▶
        </div>
      );
    case "arrow":
      return (
        <svg width="100%" height="100%">
          <line x1="2" y1="90%" x2="90%" y2="10%" stroke={obj.stroke} strokeWidth={2} />
        </svg>
      );
    default:
      return null;
  }
}

export const ObjectThumbnail: React.FC<ObjectThumbnailProps> = ({ object, size = 28 }) => {
  return (
    <div
      className="wb-object-thumbnail"
      style={{
        width: size,
        height: size,
        borderRadius: 4,
        overflow: "hidden",
        border: "1px solid #e6e8ec",
        background: "#ffffff",
        flexShrink: 0,
      }}
    >
      {getThumbnailVisual(object)}
    </div>
  );
};

export default ObjectThumbnail;
