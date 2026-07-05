// Reports/Monthly.tsx
import { PeriodPanel } from "./Weekly";
import type { ReportFormat } from "./ReportsTypes";

export function Monthly({ onGenerate, generating }: { onGenerate: (f: ReportFormat) => void; generating: boolean }) {
  return (
    <PeriodPanel
      label="Monthly snapshot"
      description="Current insights, labeled as a monthly report. Same data as Weekly/Quarterly for now."
      onGenerate={onGenerate}
      generating={generating}
    />
  );
}
