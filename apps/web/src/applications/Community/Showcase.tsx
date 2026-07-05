// Community/Showcase.tsx
import { CommunityAPI } from "./CommunityAPI";
import { useCommunityList } from "./CommunityHooks";
import { ProjectCard } from "./Widgets/ProjectCard";
import { EmptyState, LoadingSpinner } from "../../shared/components";
import { getLikedPostIds } from "./CommunityStore";

export function Showcase() {
  const { items, loading, error } = useCommunityList(CommunityAPI.getShowcase);
  const liked = getLikedPostIds();
  if (loading) return <LoadingSpinner label="Loading showcase..." />;
  if (error) return <EmptyState title="Couldn't load showcase" description={error} />;
  if (items.length === 0) return <EmptyState title="Nothing showcased yet" />;
  return <div style={{ padding: 12 }}>{items.map((p) => <ProjectCard key={p.id} post={p} liked={liked.has(p.id)} onLike={() => undefined} />)}</div>;
}
