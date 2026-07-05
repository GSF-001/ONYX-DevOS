import { useEffect, useState } from "react";
import { GroupsAPI } from "./GroupsAPI";
import { ActivityItem } from "./Widgets/ActivityItem";
import { EmptyState, LoadingSpinner } from "../../shared/components";

export function Activity({ groupId }: { groupId: number }) {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    GroupsAPI.getActivity(groupId).then(setEvents).finally(() => setLoading(false));
  }, [groupId]);

  if (loading) return <LoadingSpinner label="Loading activity..." />;
  if (events.length === 0) return <EmptyState title="No activity yet" />;

  return <div style={{ padding: 12 }}>{events.map((e) => <ActivityItem key={e.id} event={e} />)}</div>;
}
