import type { ReportJobRecord } from "./ReportsTypes";
import { ExportCSV } from "./ExportCSV";
import { ReportsAPI } from "./ReportsAPI";
import { formatDateTime } from "../../shared/utils";
import { EmptyState } from "../../shared/components";

export function Snapshot({ history }: { history: ReportJobRecord[] }) {
  if (history.length === 0) {
    return <EmptyState title="No reports generated yet" description="Generate one from the Weekly, Monthly, or Quarterly tab." />;
  }

  return (
    <div style={{ padding: 12 }}>
      {history.map((record) => (
        <div
          key={record.id}
          style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid var(--win-face-dark)" }}
        >
          <div>
            <p style={{ fontSize: 13 }}>
              {record.period} · {record.format.toUpperCase()}
            </p>
            <p style={{ fontSize: 11, color: "var(--win-text-dim)" }}>{formatDateTime(record.createdAt)}</p>
          </div>
          {record.format === "csv" ? (
            <ExportCSV record={record} />
          ) : (
            <a
              href={ReportsAPI.downloadUrl(record.filePath)}
              target="_blank"
              rel="noreferrer"
              style={{ fontSize: 12, color: "var(--win-accent)" }}
            >
              Download JSON
            </a>
          )}
        </div>
      ))}
    </div>
  );
}
