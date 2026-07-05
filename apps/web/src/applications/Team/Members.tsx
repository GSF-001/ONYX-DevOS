import type { TeamMember } from "./TeamTypes";
import { Badge, EmptyState } from "../../shared/components";

const ROLE_TONE: Record<string, "accent" | "warn" | "neutral"> = {
  owner: "accent",
  admin: "warn",
  member: "neutral",
};

export function Members({ members }: { members: TeamMember[] }) {
  if (members.length === 0) {
    return <EmptyState title="No members yet" description="Invite teammates from Settings once that flow exists." />;
  }

  return (
    <div style={{ padding: 12 }}>
      {members.map((member) => (
        <div
          key={member.id}
          style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--win-face-dark)" }}
        >
          <span style={{ fontSize: 13 }}>User #{member.userId}</span>
          <Badge tone={ROLE_TONE[member.role] ?? "neutral"}>{member.role}</Badge>
        </div>
      ))}
    </div>
  );
}
