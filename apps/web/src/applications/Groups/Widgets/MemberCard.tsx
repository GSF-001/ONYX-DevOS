import { IdentityAvatar } from "../../../shared/components";

export function MemberCard({ login, role }: { login: string; role: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0" }}>
      <IdentityAvatar handle={login} size={22} />
      <span style={{ fontSize: 12, flex: 1 }}>{login}</span>
      <span style={{ fontSize: 10, color: "var(--win-text-dim)" }}>{role}</span>
    </div>
  );
}
