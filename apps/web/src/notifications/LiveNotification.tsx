import { useSocketEvent } from "../shared/hooks";
import { useNotifications } from "./NotificationManager";
import { PullRequestNotificationBody } from "./PullRequestNotification";
import { ReviewNotificationBody } from "./ReviewNotification";
import { playNotification, playLiveSyncTick } from "../audio";

/**
 * The wiring piece: subscribes to the raw websocket events the backend
 * broadcasts (pull_request.updated, review.created, check_run.updated) and
 * turns each into a toast via NotificationManager. Mount once alongside
 * NotificationManager/Popup — this component renders nothing itself.
 */
export function LiveNotification() {
  const { add } = useNotifications();

  useSocketEvent<{ type: string; repositoryId: number; number: number; action?: string }>(
    "pull_request.updated",
    (msg) => {
      playLiveSyncTick();
      add({
        tone: "info",
        title: "Pull request updated",
        body: <PullRequestNotificationBody number={msg.number} action={msg.action} />,
        autoDismissMs: 5000,
      });
    }
  );

  useSocketEvent<{ type: string; pullRequestNumber: number; reviewer: string; state: string }>(
    "review.created",
    (msg) => {
      playNotification();
      add({
        tone: "info",
        title: "New review",
        body: (
          <ReviewNotificationBody
            reviewer={msg.reviewer}
            pullRequestNumber={msg.pullRequestNumber}
            state={msg.state}
          />
        ),
        autoDismissMs: 5000,
      });
    }
  );

  useSocketEvent<{ type: string; name: string; status: string; conclusion: string | null }>(
    "check_run.updated",
    (msg) => {
      if (msg.status !== "completed") return;
      const failed = msg.conclusion === "failure";
      add({
        tone: failed ? "error" : "success",
        title: `${msg.name} ${failed ? "failed" : "passed"}`,
        autoDismissMs: failed ? undefined : 4000,
      });
    }
  );

  return null;
}
