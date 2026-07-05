import type { GroupSummary } from "../GroupsTypes";

interface GroupCardProps {
  group: GroupSummary;
  memberCount?: number;
  onOpen: () => void;
}

export function GroupCard({ group, memberCount, onOpen }: GroupCardProps) {
  return (
    <div
      className="win-frame"
      onDoubleClick={onOpen}
      style={{ padding: 10, marginBottom: 6, display: "flex", justifyContent: "space-between", cursor: "default" }}
    >
      <div>
        <p style={{ fontWeight: 700, fontSize: 13, fontFamily: group.visibility === "anonymous" ? "var(--win-font-mono)" : "inherit" }}>
          {group.visibility === "anonymous" ? group.anonymousHandle : group.name}
        </p>
        {group.description && <p style={{ fontSize: 11, color: "var(--win-text-dim)" }}>{group.description}</p>}
      </div>
      {memberCount !== undefined && (
        <span style={{ fontSize: 12, fontFamily: "var(--win-font-mono)", color: "var(--win-text-dim)" }}>{memberCount}</span>
      )}
    </div>
  );
}
