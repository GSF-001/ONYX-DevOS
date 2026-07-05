import type { DeveloperSummary } from "../CommunityTypes";
import { IdentityAvatar } from "../../../shared/components";

export function DeveloperCard({ developer }: { developer: DeveloperSummary }) {
  return (
    <div className="win-frame" style={{ padding: 10, display: "flex", gap: 10, alignItems: "center", marginBottom: 6 }}>
      <IdentityAvatar handle={developer.login} size={32} />
      <div style={{ flex: 1 }}>
        <p style={{ fontWeight: 700, fontSize: 13 }}>{developer.login}</p>
        <p style={{ fontSize: 11, color: "var(--win-text-dim)" }}>
          {developer.pullRequestCount} PRs · {developer.reviewCount} reviews · {developer.postCount} posts
        </p>
      </div>
    </div>
  );
}
