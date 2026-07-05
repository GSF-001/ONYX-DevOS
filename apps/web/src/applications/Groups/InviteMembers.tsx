import { useState } from "react";
import { GroupsAPI } from "./GroupsAPI";

export function InviteMembers({ groupId }: { groupId: number }) {
  const [code, setCode] = useState<string | null>(null);
  const [redeemCode, setRedeemCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const generateInvite = async () => {
    const invite = await GroupsAPI.createInvite(groupId, { expiresInHours: 168 });
    setCode(invite.code);
  };

  const redeem = async () => {
    setError(null);
    try {
      await GroupsAPI.redeemInvite(redeemCode.trim());
      setRedeemCode("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid invite code.");
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <p style={{ fontSize: 11, color: "var(--win-text-dim)", marginBottom: 8 }}>GENERATE INVITE (VALID 7 DAYS)</p>
      <button className="win-button" style={{ width: "auto", padding: "6px 14px" }} onClick={generateInvite}>
        Generate Invite Code
      </button>
      {code && <p style={{ fontFamily: "var(--win-font-mono)", fontSize: 13, marginTop: 8 }}>{code}</p>}

      <p style={{ fontSize: 11, color: "var(--win-text-dim)", marginTop: 20, marginBottom: 8 }}>REDEEM AN INVITE</p>
      <div style={{ display: "flex", gap: 6 }}>
        <input value={redeemCode} onChange={(e) => setRedeemCode(e.target.value)} placeholder="Invite code" style={{ flex: 1, padding: 6, fontSize: 13 }} />
        <button className="win-button" style={{ width: "auto", padding: "0 10px" }} onClick={redeem}>Join</button>
      </div>
      {error && <p style={{ color: "var(--win-danger)", fontSize: 12, marginTop: 6 }}>{error}</p>}
    </div>
  );
}
