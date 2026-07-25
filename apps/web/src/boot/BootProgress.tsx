/**
 * ONYX DevOS — Developer Operating System
 * © 2026 GSF-001
 *
 * Proprietary Software.
 * Unauthorized use is strictly prohibited.
 */

/**
 * ONYX DevOS
 * Copyright (c) 2026 GSF-001
 * All rights reserved.
 */

import type { BootStepState } from "./BootState";

interface BootProgressProps {
  steps: BootStepState[];
}

const STATUS_LABEL: Record<BootStepState["status"], string> = {
  pending: "",
  loading: "...",
  ok: "(OK)",
  fail: "(FAIL)",
};

function dots(label: string): string {
  const targetLength = 24;
  const count = Math.max(targetLength - label.length, 3);
  return ".".repeat(count);
}

export function BootProgress({ steps }: BootProgressProps) {
  return (
    <div style={{ fontFamily: "var(--win-font-mono, monospace)", fontSize: 13 }}>
      {steps.map((step) => (
        <div
          key={step.id}
          style={{
            display: "flex",
            alignItems: "baseline",
            color: step.status === "pending" ? "#666" : "#e0e0e0",
            padding: "2px 0",
            whiteSpace: "pre",
          }}
        >
          <span>{step.label}</span>
          <span style={{ opacity: 0.4 }}>{dots(step.label)}</span>
          <span
            style={{
              color:
                step.status === "ok"
                  ? "#33FF66"
                  : step.status === "fail"
                    ? "#E5534B"
                    : "#666",
              fontWeight: 700,
            }}
          >
            {STATUS_LABEL[step.status]}
          </span>
        </div>
      ))}
    </div>
  );
}
