import type { TimelineEvent } from "../../shared/types";
import type { ActivityFeedEntry } from "../../shared/api/endpoints";

export interface LiveActivityEvent extends TimelineEvent {
  source: "live";
  pullRequestNumber?: number;
}

export interface ActivityViewState {
  history: ActivityFeedEntry[];
  loading: boolean;
  error: string | null;
}

export type EventTypeFilter = "all" | TimelineEvent["type"];

export type { TimelineEvent, ActivityFeedEntry };
