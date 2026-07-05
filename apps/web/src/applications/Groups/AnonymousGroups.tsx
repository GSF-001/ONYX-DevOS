// Groups/AnonymousGroups.tsx
import type { GroupSummary } from "./GroupsTypes";
import { GroupCard } from "./Widgets/GroupCard";
import { EmptyState } from "../../shared/components";
import { setActiveGroupId } from "./GroupsStore";

interface GroupsListProps {
  groups: GroupSummary[];
  onSelect: (groupId: number) => void;
}

export function AnonymousGroups({ groups, onSelect }: GroupsListProps) {
  if (groups.length === 0) return <EmptyState title="No anonymous groups yet" />;
  return (
    <div style={{ padding: 12 }}>
      {groups.map((g) => (
        <GroupCard key={g.id} group={g} onOpen={() => { setActiveGroupId(g.id); onSelect(g.id); }} />
      ))}
    </div>
  );
}
