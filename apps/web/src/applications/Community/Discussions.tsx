// Community/Discussions.tsx
import { CommunityAPI } from "./CommunityAPI";
import { useCommunityList } from "./CommunityHooks";
import { DiscussionCard } from "./Widgets/DiscussionCard";
import { EmptyState, LoadingSpinner } from "../../shared/components";
import { getLikedPostIds } from "./CommunityStore";

export function Discussions() {
  const { items, loading, error } = useCommunityList(CommunityAPI.getDiscussions);
  const liked = getLikedPostIds();
  if (loading) return <LoadingSpinner label="Loading discussions..." />;
  if (error) return <EmptyState title="Couldn't load discussions" description={error} />;
  if (items.length === 0) return <EmptyState title="No discussions yet" />;
  return <div style={{ padding: 12 }}>{items.map((p) => <DiscussionCard key={p.id} post={p} liked={liked.has(p.id)} onLike={() => undefined} />)}</div>;
}
