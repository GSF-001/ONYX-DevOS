import type { Repository } from "./RepositoryTypes";

export function Statistics({ repository }: { repository: Repository }) {
  return (
    <div style={{ padding: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
      <Stat label="Owner" value={repository.owner} />
      <Stat label="Visibility" value={repository.private ? "Private" : "Public"} />
      <Stat label="Default branch" value={repository.defaultBranch ?? "main"} />
      <Stat label="Connected since" value={new Date(repository.createdAt).toLocaleDateString()} />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p style={{ fontSize: 11, color: "var(--win-text-dim)" }}>{label.toUpperCase()}</p>
      <p style={{ fontSize: 13, fontWeight: 600 }}>{value}</p>
    </div>
  );
}
