import { useEffect, useRef, useState } from "react";
import { GroupsAPI } from "./GroupsAPI";
import type { ChatMessage } from "./GroupsTypes";
import { usePolling } from "../../shared/hooks";
import { IdentityAvatar } from "../../shared/components";
import { formatRelativeTime } from "../../shared/utils";

export function Chat({ groupId }: { groupId: number }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  usePolling(() => {
    GroupsAPI.getMessages(groupId).then(setMessages);
  }, 3000); // chat polls faster than other lists — 3s

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);

  const send = async () => {
    if (!input.trim()) return;
    const body = input;
    setInput("");
    await GroupsAPI.postMessage(groupId, body);
    GroupsAPI.getMessages(groupId).then(setMessages); // immediate refresh after sending
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ flex: 1, overflowY: "auto", padding: 10 }}>
        {messages.map((m) => (
          <div key={m.id} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <IdentityAvatar handle={m.login} size={22} />
            <div>
              <div style={{ display: "flex", gap: 6, alignItems: "baseline" }}>
                <span style={{ fontWeight: 700, fontSize: 12 }}>{m.login}</span>
                <span style={{ fontSize: 10, color: "var(--win-text-faint)" }}>{formatRelativeTime(m.createdAt)}</span>
              </div>
              <p style={{ fontSize: 13 }}>{m.body}</p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div style={{ display: "flex", gap: 6, padding: 10, borderTop: "1px solid var(--win-face-dark)" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Type a message..."
          style={{ flex: 1, padding: 8, fontSize: 13 }}
        />
        <button className="win-button" style={{ width: "auto", padding: "0 14px" }} onClick={send}>Send</button>
      </div>
    </div>
  );
}
