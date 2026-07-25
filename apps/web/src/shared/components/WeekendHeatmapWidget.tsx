/**
 * ONYX DevOS
 * Copyright (c) 2026 GSF-001
 * All rights reserved.
 */

import type { WeekendHeatmapResult } from "../types";
import { formatPercent } from "../utils/formatNumber";

interface WeekendHeatmapWidgetProps {
  data: WeekendHeatmapResult;
}

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const CELL_SIZE = 12;
const CELL_GAP = 3;

// GitHub-style discrete levels instead of a continuous gradient — reads
// cleaner at a glance than smoothly-interpolated alpha.
const LEVEL_COLORS = [
  "var(--color-bg-inset)", // 0 — no activity
  "#0e4429",
  "#006d32",
  "#26a641",
  "#39d353",
];

function levelFor(count: number, max: number): number {
  if (count === 0 || max === 0) return 0;
  const ratio = count / max;
  if (ratio <= 0.25) return 1;
  if (ratio <= 0.5) return 2;
  if (ratio <= 0.75) return 3;
  return 4;
}

/**
 * 7x24 commit activity grid. Shared between the Insights overview (compact)
 * and the dedicated Heatmap page (full size) — same data shape, same color
 * scale, so the reading doesn't shift between contexts. Cells are a fixed
 * size (GitHub-contribution-graph style) rather than stretched to fill the
 * container, so they stay small and legible at any window width.
 */
export function WeekendHeatmapWidget({ data }: WeekendHeatmapWidgetProps) {
  const maxCount = Math.max(1, ...data.cells.map((c) => c.count));

  return (
    <div>
      <div style={{ display: "flex", gap: CELL_GAP, marginBottom: 6 }}>
        <div style={{ width: 34 }} />
        <div style={{ display: "grid", gridTemplateColumns: `repeat(24, ${CELL_SIZE}px)`, gap: CELL_GAP }}>
          {Array.from({ length: 24 }, (_, hour) => (
            <span
              key={hour}
              style={{
                fontSize: 9,
                color: "var(--color-text-faint)",
                textAlign: "center",
                visibility: hour % 4 === 0 ? "visible" : "hidden",
              }}
            >
              {hour}
            </span>
          ))}
        </div>
      </div>

      {DAY_LABELS.map((label, day) => (
        <div key={label} style={{ display: "flex", gap: CELL_GAP, marginBottom: CELL_GAP, alignItems: "center" }}>
          <span
            style={{
              width: 34,
              fontSize: 11,
              color: "var(--color-text-dim)",
            }}
          >
            {label}
          </span>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(24, ${CELL_SIZE}px)`, gap: CELL_GAP }}>
            {Array.from({ length: 24 }, (_, hour) => {
              const cell = data.cells.find((c) => c.dayOfWeek === day && c.hour === hour);
              const count = cell?.count ?? 0;
              const level = levelFor(count, maxCount);
              return (
                <div
                  key={hour}
                  title={`${label} ${hour}:00 — ${count} commit${count === 1 ? "" : "s"}`}
                  style={{
                    width: CELL_SIZE,
                    height: CELL_SIZE,
                    borderRadius: 2,
                    background: LEVEL_COLORS[level],
                  }}
                />
              );
            })}
          </div>
        </div>
      ))}

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
        <p style={{ fontSize: 12, color: "var(--color-text-dim)", margin: 0 }}>
          {formatPercent(data.weekendCommitRatio)} of commits land on a weekend.
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "var(--color-text-faint)" }}>
          <span>Less</span>
          {LEVEL_COLORS.map((color, i) => (
            <div key={i} style={{ width: CELL_SIZE, height: CELL_SIZE, borderRadius: 2, background: color }} />
          ))}
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
