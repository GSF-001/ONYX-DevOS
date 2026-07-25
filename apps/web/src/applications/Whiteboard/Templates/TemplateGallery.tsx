/**
 * ONYX DevOS — Developer Operating System
 * © 2026 GSF-001
 *
 * Proprietary Software.
 * Unauthorized use is strictly prohibited.
 */

// Templates/TemplateGallery.tsx

import React, { useMemo, useState } from "react";
import { Template } from "../WhiteboardTypes";
import { TEMPLATE_CATEGORIES } from "./TemplateCategories";
import { TemplateItem } from "./TemplateItem";

interface TemplateGalleryProps {
  templates: Template[];
  onUse: (template: Template) => void;
  onClose: () => void;
}

export const TemplateGallery: React.FC<TemplateGalleryProps> = ({ templates, onUse, onClose }) => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return templates.filter((t) => {
      const matchesCategory = activeCategory === "all" || t.category === activeCategory;
      const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [templates, activeCategory, search]);

  return (
    <div
      className="wb-template-gallery-overlay"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(20,22,28,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(880px, 92vw)",
          maxHeight: "84vh",
          background: "#ffffff",
          borderRadius: 14,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
        }}
      >
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid #e6e8ec",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <h2 style={{ fontSize: 16, margin: 0, flex: 1 }}>Choose a template</h2>
          <input
            placeholder="Search templates"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              fontSize: 13,
              padding: "6px 10px",
              border: "1px solid #e6e8ec",
              borderRadius: 8,
              width: 200,
            }}
          />
          <button
            onClick={onClose}
            style={{ border: "none", background: "none", fontSize: 18, cursor: "pointer" }}
          >
            ✕
          </button>
        </div>

        <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
          <div
            style={{
              width: 180,
              borderRight: "1px solid #e6e8ec",
              padding: 10,
              overflowY: "auto",
            }}
          >
            {TEMPLATE_CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  padding: "8px 10px",
                  borderRadius: 8,
                  fontSize: 13,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: activeCategory === cat.id ? "rgba(77,124,254,0.12)" : "transparent",
                  color: activeCategory === cat.id ? "#4d7cfe" : "#3a3f4a",
                }}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </div>
            ))}
          </div>

          <div
            style={{
              flex: 1,
              padding: 16,
              overflowY: "auto",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
              gap: 12,
              alignContent: "start",
            }}
          >
            {filtered.map((t) => (
              <TemplateItem key={t.id} template={t} onUse={onUse} />
            ))}
            {filtered.length === 0 && (
              <div style={{ fontSize: 13, color: "#9aa0ac", gridColumn: "1 / -1", textAlign: "center", padding: 40 }}>
                No templates match your search.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateGallery;
