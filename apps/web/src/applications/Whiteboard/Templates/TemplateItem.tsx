/**
 * ONYX DevOS — Developer Operating System
 * © 2026 GSF-001
 *
 * Proprietary Software.
 * Unauthorized use is strictly prohibited.
 */

// Templates/TemplateItem.tsx

import React from "react";
import { Template } from "../WhiteboardTypes";

interface TemplateItemProps {
  template: Template;
  onUse: (template: Template) => void;
}

export const TemplateItem: React.FC<TemplateItemProps> = ({ template, onUse }) => {
  return (
    <div
      className="wb-template-item"
      onClick={() => onUse(template)}
      style={{
        border: "1px solid #e6e8ec",
        borderRadius: 10,
        padding: 14,
        cursor: "pointer",
        background: "#ffffff",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        transition: "box-shadow 120ms ease, transform 120ms ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 4px 14px rgba(0,0,0,0.08)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = "none";
      }}
    >
      <div
        style={{
          fontSize: 28,
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f7f8fa",
          borderRadius: 8,
        }}
      >
        {template.thumbnail}
      </div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#1c1f26" }}>{template.name}</div>
        <div style={{ fontSize: 11, color: "#9aa0ac", marginTop: 2 }}>
          {template.objects.length} objects
        </div>
      </div>
    </div>
  );
};

export default TemplateItem;
