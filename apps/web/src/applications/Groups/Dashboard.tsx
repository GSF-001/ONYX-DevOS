import { useEffect, useState } from "react";
import { GroupsAPI } from "./GroupsAPI";
import { OnlineUsers } from "./Widgets/OnlineUsers";
import { LoadingSpinner } from "../../shared/components";

/** Per-group overview: member list — named "Dashboard" per your tree to
 * distinguish from the top-level app Dashboard, scoped to one group. */
export function Dashboard({ groupId }: { groupId: number }) {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    GroupsAPI.getMembers(groupId).then(setMembers).finally(() => setLoading(false));
  }, [groupId]);

  if (loading) return <LoadingSpinner label="Loading members..." />;
  return <OnlineUsers members={members} />;
}
