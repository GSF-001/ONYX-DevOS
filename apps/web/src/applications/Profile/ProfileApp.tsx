/**
 * ONYX DevOS — Developer Operating System
 * © 2026 GSF-001
 *
 * Proprietary Software.
 * Unauthorized use is strictly prohibited.
 */

/**
 * ONYX DevOS
 * Copyright (c) 2026 GSF-001
 * All rights reserved.
 */

import { useState } from "react";
import femaleProfile from "../../assets/female-profile.png";
import maleProfile from "../../assets/male-profile.png";

type Gender = "male" | "female";
type NavItem =
  | "overview" | "reputation" | "achievements" | "badges"
  | "contributions" | "plugins" | "bounties" | "repositories" | "settings";

const NAV_ITEMS: { id: NavItem; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "reputation", label: "Reputation" },
  { id: "achievements", label: "Achievements" },
  { id: "badges", label: "Badges" },
  { id: "contributions", label: "Contributions" },
  { id: "plugins", label: "Plugins" },
  { id: "bounties", label: "Bounties" },
  { id: "repositories", label: "Repositories" },
  { id: "settings", label: "Settings" },
];

const MENU_ITEMS = ["File", "Edit", "View", "Favorites", "Help"];

const STATS = {
  developerId: "#8A31F9",
  memberSince: "10/05/26",
  reputation: 8.4,
  bountiesCompleted: 37,
  pluginsPublished: 5,
  repositoriesConnected: 12,
  online: true,
};

// ---- Windows 95/98 palette ----
const C = {
  face: "#c0c0c0",
  faceDark: "#a0a0a0",
  light: "#ffffff",
  highlight: "#dfdfdf",
  shadow: "#808080",
  darkShadow: "#000000",
  titleBarFrom: "#000080",
  titleBarTo: "#1084d0",
  titleText: "#ffffff",
  inputBg: "#ffffff",
  selectBlue: "#000080",
  selectText: "#ffffff",
  online: "#008000",
  starGold: "#c08000",
  starEmpty: "#808080",
  scrollTrack: "#dcdcdc",
};

const FONT = `"MS Sans Serif", Tahoma, "Segoe UI", sans-serif`;

const outsetBorder: React.CSSProperties = {
  borderStyle: "solid",
  borderWidth: 2,
  borderTopColor: C.light,
  borderLeftColor: C.light,
  borderRightColor: C.darkShadow,
  borderBottomColor: C.darkShadow,
  boxShadow: `inset 1px 1px 0 ${C.highlight}, inset -1px -1px 0 ${C.shadow}`,
};

const insetBorder: React.CSSProperties = {
  borderStyle: "solid",
  borderWidth: 2,
  borderTopColor: C.shadow,
  borderLeftColor: C.shadow,
  borderRightColor: C.light,
  borderBottomColor: C.light,
  boxShadow: `inset 1px 1px 0 ${C.darkShadow}`,
};

const pressedBorder: React.CSSProperties = {
  borderStyle: "solid",
  borderWidth: 2,
  borderTopColor: C.darkShadow,
  borderLeftColor: C.darkShadow,
  borderRightColor: C.light,
  borderBottomColor: C.light,
  boxShadow: `inset 1px 1px 0 ${C.shadow}`,
};

function StarRow({ score }: { score: number }) {
  const full = Math.round(score / 2);
  return (
    <span style={{ letterSpacing: 1, fontSize: 12 }}>
      <span style={{ color: C.starGold }}>{"★".repeat(full)}</span>
      <span style={{ color: C.starEmpty }}>{"★".repeat(5 - full)}</span>
    </span>
  );
}

const statRowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "5px 2px",
  fontSize: 12,
  color: "#000",
};

const win95ScrollbarCSS = `
  .win95-scroll::-webkit-scrollbar { width: 16px; height: 16px; }
  .win95-scroll::-webkit-scrollbar-track { background: ${C.scrollTrack}; }
  .win95-scroll::-webkit-scrollbar-thumb {
    background: ${C.face};
    border: 2px solid;
    border-top-color: ${C.light}; border-left-color: ${C.light};
    border-right-color: ${C.darkShadow}; border-bottom-color: ${C.darkShadow};
  }
  .win95-scroll::-webkit-scrollbar-button { display: none; }
  .win95-focusable:focus-visible {
    outline: 1px dotted #000;
    outline-offset: -3px;
  }
`;

export default function ProfileApp() {
  const [active, setActive] = useState<NavItem>("overview");
  const [gender, setGender] = useState<Gender>(() => {
    return (localStorage.getItem("onyx.profileGender") as Gender) || "male";
  });
  const [name, setName] = useState<string>(() => {
    return localStorage.getItem("onyx.profileName") || "PIXEL";
  });
  const [editingName, setEditingName] = useState(false);
  const [avatarPressed, setAvatarPressed] = useState<Gender | null>(null);

  const changeGender = (g: Gender) => {
    setGender(g);
    localStorage.setItem("onyx.profileGender", g);
  };

  const saveName = (value: string) => {
    const cleaned = value.replace(/^ONYX:\/\//i, "").trim() || "PIXEL";
    setName(cleaned);
    localStorage.setItem("onyx.profileName", cleaned);
    setEditingName(false);
  };

  const avatarSrc = gender === "female" ? femaleProfile : maleProfile;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        fontFamily: FONT,
        background: C.face,
        ...outsetBorder,
      }}
    >
      <style>{win95ScrollbarCSS}</style>

      {/* Title bar */}
      <div
        style={{
          height: 22,
          background: `linear-gradient(90deg, ${C.titleBarFrom}, ${C.titleBarTo})`,
          display: "flex",
          alignItems: "center",
          padding: "0 6px",
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: 12, marginRight: 6 }}>👤</span>
        <span style={{ color: C.titleText, fontSize: 12, fontWeight: 700, letterSpacing: 0.3 }}>
          ONYX://{name} — Profile
        </span>
      </div>

      {/* Menu bar */}
      <div
        style={{
          display: "flex",
          gap: 2,
          padding: "2px 4px",
          background: C.face,
          borderBottom: `1px solid ${C.shadow}`,
          flexShrink: 0,
        }}
      >
        {MENU_ITEMS.map((m) => (
          <span
            key={m}
            className="win95-focusable"
            tabIndex={0}
            style={{
              fontSize: 12,
              padding: "2px 8px",
              cursor: "default",
              color: "#000",
            }}
            onMouseDown={(e) => (e.currentTarget.style.background = C.selectBlue)}
            onMouseUp={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <span style={{ textDecoration: "underline" }}>{m.charAt(0)}</span>
            {m.slice(1)}
          </span>
        ))}
      </div>

      {/* Body */}
      <div style={{ display: "flex", flex: 1, minHeight: 0, padding: 3, gap: 3 }}>
        {/* Sidebar */}
        <div
          className="win95-scroll"
          style={{
            width: 150,
            background: C.inputBg,
            ...insetBorder,
            padding: 2,
            display: "flex",
            flexDirection: "column",
            gap: 1,
            overflowY: "auto",
          }}
        >
          {NAV_ITEMS.map((item) => (
            <div
              key={item.id}
              tabIndex={0}
              className="win95-focusable"
              onClick={() => setActive(item.id)}
              style={{
                padding: "5px 8px",
                fontSize: 12,
                fontWeight: 700,
                cursor: "default",
                background: active === item.id ? C.selectBlue : "transparent",
                color: active === item.id ? C.selectText : "#000",
              }}
            >
              {item.label}
            </div>
          ))}

          <div style={{ flex: 1 }} />

          <div
            style={{
              fontSize: 10,
              color: "#666",
              padding: "6px 4px 2px 4px",
              borderTop: `1px solid ${C.faceDark}`,
              marginTop: 4,
            }}
          >
            {NAV_ITEMS.length} object(s)
          </div>
        </div>

        {/* Main panel */}
        <div
          className="win95-scroll"
          style={{
            flex: 1,
            background: C.face,
            padding: 12,
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
          }}
        >
          {active === "overview" && (
            <>
              <div
                style={{
                  display: "flex",
                  gap: 14,
                  alignItems: "center",
                  marginBottom: 14,
                  background: C.inputBg,
                  ...insetBorder,
                  padding: 10,
                }}
              >
                <img
                  src={avatarSrc}
                  alt="avatar"
                  style={{ width: 56, height: 56, ...outsetBorder, objectFit: "cover" }}
                />
                <div>
                  {editingName ? (
                    <input
                      autoFocus
                      defaultValue={`ONYX://${name}`}
                      onBlur={(e) => saveName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && saveName((e.target as HTMLInputElement).value)}
                      style={{
                        fontSize: 13,
                        fontFamily: FONT,
                        fontWeight: 700,
                        padding: "2px 4px",
                        ...insetBorder,
                        background: C.inputBg,
                      }}
                    />
                  ) : (
                    <h2
                      onClick={() => setEditingName(true)}
                      style={{ margin: 0, fontSize: 14, fontWeight: 700, cursor: "pointer", color: "#000" }}
                      title="Click to edit"
                    >
                      ONYX://{name}
                    </h2>
                  )}
                  <p style={{ margin: "4px 0 0 0", fontSize: 11, color: "#000" }}>
                    Developer ID: {STATS.developerId}
                  </p>
                  <p style={{ margin: "2px 0 0 0", fontSize: 11, color: "#000" }}>
                    Member since: {STATS.memberSince}
                  </p>
                </div>
              </div>

              {/* Avatar groupbox */}
              <fieldset
                style={{
                  border: `2px groove ${C.shadow}`,
                  marginBottom: 14,
                  padding: "6px 10px 10px 10px",
                }}
              >
                <legend style={{ fontSize: 11, padding: "0 4px", color: "#000" }}>Avatar</legend>
                <div style={{ display: "flex", gap: 8 }}>
                  {(["male", "female"] as Gender[]).map((g) => {
                    const isSelected = gender === g;
                    const isPressed = avatarPressed === g;
                    const src = g === "male" ? maleProfile : femaleProfile;
                    return (
                      <div
                        key={g}
                        tabIndex={0}
                        className="win95-focusable"
                        onMouseDown={() => setAvatarPressed(g)}
                        onMouseUp={() => setAvatarPressed(null)}
                        onMouseLeave={() => setAvatarPressed(null)}
                        onClick={() => changeGender(g)}
                        style={{
                          padding: 3,
                          cursor: "pointer",
                          background: isSelected ? C.selectBlue : C.face,
                          ...(isPressed ? pressedBorder : outsetBorder),
                        }}
                      >
                        <img
                          src={src}
                          alt={g}
                          style={{
                            width: 40,
                            height: 40,
                            display: "block",
                            transform: isPressed ? "translate(1px, 1px)" : "none",
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </fieldset>

              {/* Stats groupbox */}
              <fieldset
                style={{
                  border: `2px groove ${C.shadow}`,
                  padding: "6px 12px 10px 12px",
                }}
              >
                <legend style={{ fontSize: 11, padding: "0 4px", color: "#000" }}>Statistics</legend>
                <div style={statRowStyle}>
                  <span>Reputation</span>
                  <span style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    {STATS.reputation.toFixed(1)} <StarRow score={STATS.reputation} />
                  </span>
                </div>
                <div style={{ borderTop: `1px solid ${C.shadow}`, borderBottom: `1px solid ${C.light}` }} />
                <div style={statRowStyle}>
                  <span>Bounties Completed</span>
                  <span>{STATS.bountiesCompleted}</span>
                </div>
                <div style={{ borderTop: `1px solid ${C.shadow}`, borderBottom: `1px solid ${C.light}` }} />
                <div style={statRowStyle}>
                  <span>Plugins Published</span>
                  <span>{STATS.pluginsPublished}</span>
                </div>
                <div style={{ borderTop: `1px solid ${C.shadow}`, borderBottom: `1px solid ${C.light}` }} />
                <div style={statRowStyle}>
                  <span>Repositories Connected</span>
                  <span>{STATS.repositoriesConnected}</span>
                </div>
              </fieldset>

              <div style={{ flex: 1 }} />
            </>
          )}

          {active !== "overview" && (
            <div
              style={{
                ...insetBorder,
                background: C.inputBg,
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <p style={{ color: "#000", fontSize: 12 }}>
                {NAV_ITEMS.find((n) => n.id === active)?.label} — coming soon.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Status bar — classic 3-panel */}
      <div style={{ display: "flex", gap: 2, padding: "2px 3px 3px 3px", flexShrink: 0 }}>
        <div
          style={{
            ...insetBorder,
            flex: 1,
            padding: "2px 8px",
            fontSize: 11,
            color: "#000",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span style={{ color: C.online }}>●</span>
          {STATS.online ? "Online" : "Offline"}
        </div>
        <div style={{ ...insetBorder, width: 90, padding: "2px 8px", fontSize: 11, color: "#000" }}>
          ID {STATS.developerId}
        </div>
        <div style={{ ...insetBorder, width: 70, padding: "2px 8px", fontSize: 11, color: "#000" }}>
          v1.0
        </div>
      </div>
    </div>
  );
}
