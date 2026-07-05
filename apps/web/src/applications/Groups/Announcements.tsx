import { useEffect, useState } from "react";
import { GroupsAPI } from "./GroupsAPI";
import { EmptyState, LoadingSpinner } from "../../shared/components";
import { formatDateTime } from "../../shared/utils";

export function Announcements({ groupId }: { groupId: number }) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);

  const load = () => GroupsAPI.getAnnouncements(groupId).then(setItems).finally(() => setLoading(false));

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId]);

  const post = async () => {
    if (!title.trim() || !body.trim()) return;
    setError(null);
    try {
      await GroupsAPI.postAnnouncement(groupId, title, body);
      setTitle("");
      setBody("");
      void load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Only owners/admins can post announcements.");
    }
  };

  if (loading) return <LoadingSpinner label="Loading announcements..." />;

  return (
    <div style={{ padding: 12 }}>
      <div style={{ marginBottom: 16, display: "flex", flexDirection: "column", gap: 6 }}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" style={{ padding: 6, fontSize: 13 }} />
        <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Announcement..." style={{ padding: 6, fontSize: 13, resize: "vertical" }} rows={2} />
        {error && <p style={{ color: "var(--win-danger)", fontSize: 11 }}>{error}</p>}
        <button className="win-button" style={{ width: "auto", padding: "4px 12px", alignSelf: "flex-start" }} onClick={post}>Post</button>
      </div>

      {items.length === 0 ? (
        <EmptyState title="No announcements yet" />
      ) : (
        items.map((a) => (
          <div key={a.id} className="win-frame" style={{ padding: 10, marginBottom: 6 }}>
            <p style={{ fontWeight: 700, fontSize: 13 }}>{a.title}</p>
            <p style={{ fontSize: 12, color: "var(--win-text-dim)" }}>{a.body}</p>
            <p style={{ fontSize: 10, color: "var(--win-text-faint)", marginTop: 4 }}>{formatDateTime(a.createdAt)}</p>
          </div>
        ))
      )}
    </div>
  );
}
