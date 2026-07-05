import type { GroupMember } from "../GroupsTypes";
import { MemberCard } from "./MemberCard";
import { EmptyState } from "../../../shared/components";

/**
 * Honest note: there's no real presence/online-tracking system built yet
 * (would need heartbeat pings per group room). Renders the member list
 * without a fabricated "online" status rather than faking presence data.
 */
export function OnlineUsers({ members }: { members: (GroupMember & { login?: string })[] }) {
  if (members.length === 0) return <EmptyState title="No members yet" />;
  return (
    <div style={{ padding: 10 }}>
      {members.map((m) => (
        <MemberCard key={m.id} login={m.login ?? `user #${m.userId}`} role={m.role} />
      ))}
    </div>
  );
}
