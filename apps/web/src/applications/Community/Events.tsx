// Community/Events.tsx
import { CommunityAPI } from "./CommunityAPI";
import { useCommunityList } from "./CommunityHooks";
import { EventCard } from "./Widgets/EventCard";
import { EmptyState, LoadingSpinner } from "../../shared/components";

export function Events() {
  const { items, loading, error } = useCommunityList(CommunityAPI.getEvents);
  if (loading) return <LoadingSpinner label="Loading events..." />;
  if (error) return <EmptyState title="Couldn't load events" description={error} />;
  if (items.length === 0) return <EmptyState title="No upcoming events" />;
  return <div style={{ padding: 12 }}>{items.map((e) => <EventCard key={e.id} event={e} />)}</div>;
}
