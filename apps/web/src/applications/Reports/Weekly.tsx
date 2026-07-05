// Reports/Weekly.tsx
import type { ReportFormat } from "./ReportsTypes";

interface PeriodPanelProps {
  onGenerate: (format: ReportFormat) => void;
  generating: boolean;
}

export function Weekly({ onGenerate, generating }: PeriodPanelProps) {
  return (
    <PeriodPanel
      label="Weekly snapshot"
      description="Current insights, labeled as a weekly report. Same underlying data as Monthly/Quarterly today — period-specific rollups aren't computed server-side yet."
      onGenerate={onGenerate}
      generating={generating}
    />
  );
}

export function PeriodPanel({
  label,
  description,
  onGenerate,
  generating,
}: PeriodPanelProps & { label: string; description: string }) {
  return (
    <div style={{ padding: 16 }}>
      <p style={{ fontWeight: 700, marginBottom: 4 }}>{label}</p>
      <p style={{ fontSize: 12, color: "var(--win-text-dim)", marginBottom: 12 }}>{description}</p>
      <div style={{ display: "flex", gap: 8 }}>
        <button className="win-button" style={{ width: "auto", padding: "4px 12px" }} disabled={generating} onClick={() => onGenerate("csv")}>
          {generating ? "Generating..." : "Export CSV"}
        </button>
        <button className="win-button" style={{ width: "auto", padding: "4px 12px" }} disabled={generating} onClick={() => onGenerate("json")}>
          {generating ? "Generating..." : "Export JSON"}
        </button>
      </div>
    </div>
  );
}
