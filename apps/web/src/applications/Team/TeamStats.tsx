/**
 * ONYX DevOS
 * Copyright (c) 2026 GSF-001
 * All rights reserved.
 */

import type { TeamViewState } from "./TeamTypes";

const DONUT_COLORS = {
  high: "#e5484d",
  medium: "#f5a623",
  low: "#4fb0a5",
  idle: "#6b7280",
};

/** Summary strip at the top of the Team window — real aggregates
 * (headcount, pending/completed reviews) plus a workload donut derived
 * purely from reviewerLoad: overloaded members are "high", members with
 * 2+ pending reviews are "medium", anyone with any activity is "low",
 * and members with zero pending/completed reviews are "idle". */
export function TeamStats({ members, reviewerLoad }: Pick<TeamViewState, "members" | "reviewerLoad">) {
  const totalPending = reviewerLoad.reduce((sum, r) => sum + r.pendingReviewCount, 0);
  const totalCompleted = reviewerLoad.reduce((sum, r) => sum + r.completedReviewCount30d, 0);
  const overloadedCount = reviewerLoad.filter((r) => r.overloaded).length;

  const workload = { high: 0, medium: 0, low: 0, idle: 0 };
  for (const r of reviewerLoad) {
    if (r.overloaded) workload.high++;
    else if (r.pendingReviewCount >= 2) workload.medium++;
    else if (r.pendingReviewCount > 0 || r.completedReviewCount30d > 0) workload.low++;
    else workload.idle++;
  }
  const total = Math.max(1, workload.high + workload.medium + workload.low + workload.idle);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 16,
        padding: 12,
        borderBottom: "1px solid var(--win-face-dark)",
      }}
    >
      <div style={{ display: "flex", gap: 16 }}>
        <Stat label="Members" value={members.length} />
        <Stat label="Pending reviews" value={totalPending} />
        <Stat label="Reviews (30d)" value={totalCompleted} />
        <Stat label="Overloaded" value={overloadedCount} tone={overloadedCount > 0 ? "var(--win-danger)" : undefined} />
      </div>
      <WorkloadDonut workload={workload} total={total} />
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: number; tone?: string }) {
  return (
    <div>
      <p style={{ fontSize: 10, color: "var(--win-text-dim)" }}>{label.toUpperCase()}</p>
      <p style={{ fontSize: 20, fontFamily: "var(--win-font-mono)", fontWeight: 700, color: tone }}>{value}</p>
    </div>
  );
}

function WorkloadDonut({
  workload,
  total,
}: {
  workload: { high: number; medium: number; low: number; idle: number };
  total: number;
}) {
  const segments: { key: keyof typeof DONUT_COLORS; value: number }[] = [
    { key: "high", value: workload.high },
    { key: "medium", value: workload.medium },
    { key: "low", value: workload.low },
    { key: "idle", value: workload.idle },
  ];

  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <svg width="72" height="72" viewBox="0 0 72 72" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="36" cy="36" r={radius} fill="none" stroke="var(--win-face-dark)" strokeWidth="10" />
        {segments.map((seg) => {
          if (seg.value === 0) return null;
          const fraction = seg.value / total;
          const dash = fraction * circumference;
          const circle = (
            <circle
              key={seg.key}
              cx="36"
              cy="36"
              r={radius}
              fill="none"
              stroke={DONUT_COLORS[seg.key]}
              strokeWidth="10"
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={-offset}
            />
          );
          offset += dash;
          return circle;
        })}
      </svg>
      <div style={{ display: "flex", flexDirection: "column", gap: 3, fontSize: 11 }}>
        <LegendRow color={DONUT_COLORS.high} label="High" value={workload.high} />
        <LegendRow color={DONUT_COLORS.medium} label="Medium" value={workload.medium} />
        <LegendRow color={DONUT_COLORS.low} label="Low" value={workload.low} />
        <LegendRow color={DONUT_COLORS.idle} label="Idle" value={workload.idle} />
      </div>
    </div>
  );
}

function LegendRow({ color, label, value }: { color: string; label: string; value: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: color, display: "inline-block" }} />
      <span style={{ color: "var(--win-text-dim)" }}>{label}</span>
      <span style={{ fontFamily: "var(--win-font-mono)" }}>{value}</span>
    </div>
  );
}
