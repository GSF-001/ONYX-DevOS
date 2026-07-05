import { useEffect, useRef, useState } from "react";
import { GroupsAPI } from "./GroupsAPI";
import type { ChatMessage } from "./GroupsTypes";
import { useWebSocket, useSocketEvent } from "../../shared/hooks";
import { IdentityAvatar } from "../../shared/components";
import { formatRelativeTime } from "../../shared/utils";

interface ChatProps {
  groupId: number;
}

/**
 * Real-time chat: loads history via REST, subscribes to the group's
 * websocket room (`group:{id}`) for live incoming messages, and posts new
 * messages via REST (the server then broadcasts to the room — see
 * routes/groups.ts's POST /groups/:groupId/messages handler).
 */
export function Chat({ groupId }: ChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  useWebSocket(`group:${groupId}`);

  useEffect(() => {
    let cancelled = false;
    GroupsAPI.getMessages(groupId).then((history) => !cancelled && setMessages(history));
    return () => {
      cancelled = true;
    };
  }, [groupId]);

  useSocketEvent<ChatMessage & { type: string }>("group.message", (msg) => {
    setMessages((prev) => [...prev, msg]);
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);

  const send = async () => {
    if (!input.trim()) return;
    const body = input;
    setInput("");
    await GroupsAPI.postMessage(groupId, body);
    // The message will also arrive back via the websocket broadcast;
    // no optimistic append here to avoid a duplicate entry.
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
