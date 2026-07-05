import type { FeedPost } from "../CommunityTypes";
import { IdentityAvatar } from "../../../shared/components";
import { formatRelativeTime } from "../../../shared/utils";

interface PostCardProps {
  post: FeedPost;
  liked: boolean;
  onLike: () => void;
}

/** Generic card used for project/discussion/showcase posts alike — the
 * `type` badge is the only visual differentiator, avoiding four near-
 * identical card components. */
export function ProjectCard({ post, liked, onLike }: PostCardProps) {
  return (
    <div className="win-frame" style={{ padding: 10, marginBottom: 8 }}>
      <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
        <IdentityAvatar handle={post.authorLogin} size={28} />
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontWeight: 700, fontSize: 13 }}>{post.title}</span>
            <span style={{ fontSize: 10, color: "var(--win-text-faint)" }}>{formatRelativeTime(post.createdAt)}</span>
          </div>
          <p style={{ fontSize: 12, color: "var(--win-text-dim)", marginTop: 2 }}>{post.body}</p>
          {post.url && (
            <a href={post.url} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: "var(--win-accent)" }}>
              {post.url}
            </a>
          )}
          <div style={{ display: "flex", gap: 12, marginTop: 6, fontSize: 11 }}>
            <span onClick={onLike} style={{ cursor: "default", color: liked ? "var(--win-danger)" : "var(--win-text-dim)" }}>
              {liked ? "♥" : "♡"} {post.likeCount + (liked ? 1 : 0)}
            </span>
            <span style={{ color: "var(--win-text-dim)" }}>💬 {post.commentCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
