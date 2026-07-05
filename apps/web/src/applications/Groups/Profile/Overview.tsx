import { useEffect, useState } from "react";
import type { ProfileData } from "./ProfileTypes";
import { IdentityAPI } from "../../identity";
import { IdentityPreview } from "../../identity";
import { formatDateTime } from "../../shared/utils";

export function Overview({ profile }: { profile: ProfileData }) {
  const [handle, setHandle] = useState<string | null>(null);

  useEffect(() => {
    IdentityAPI.getMe().then((identity) => setHandle(identity.handle)).catch(() => setHandle(null));
  }, []);

  return (
    <div style={{ padding: 16, display: "flex", gap: 16 }}>
      {handle ? (
        <IdentityPreview handle={handle} developerId={profile.developerId} size={72} />
      ) : (
        <div style={{ width: 64, height: 64, borderRadius: 4, background: "var(--win-face-dark)" }} />
      )}
      <div>
        <p style={{ fontSize: 11, color: "var(--win-text-dim)" }}>
          Member since {formatDateTime(profile.memberSince)}
        </p>
      </div>
    </div>
  );
}
