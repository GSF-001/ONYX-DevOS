import { useEffect, useState } from "react";
import { GroupsAPI } from "./GroupsAPI";
import { EmptyState, LoadingSpinner } from "../../shared/components";

export function Files({ groupId }: { groupId: number }) {
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    GroupsAPI.getFiles(groupId).then(setFiles).finally(() => setLoading(false));
  }, [groupId]);

  if (loading) return <LoadingSpinner label="Loading files..." />;
  if (files.length === 0) return <EmptyState title="No files shared yet" />;

  return (
    <div style={{ padding: 12 }}>
      {files.map((f) => (
        <div key={f.id} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid var(--win-face-dark)", fontSize: 12 }}>
          <span>{f.fileName}</span>
          <span style={{ color: "var(--win-text-dim)" }}>{(f.sizeBytes / 1024).toFixed(1)} KB</span>
        </div>
      ))}
    </div>
  );
}
