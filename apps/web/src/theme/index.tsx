/**
 * ONYX DevOS
 * Copyright (c) 2026 GSF-001
 * All rights reserved.
 */

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { TOKENS, type Theme } from "./tokens";
import { pixelTheme } from "./themes/pixel";
import { crtTheme } from "./themes/crt";
import { modernTheme } from "./themes/modern";
import { darkTheme } from "./themes/dark";

export const THEMES: Record<string, Theme> = {
  pixel: pixelTheme,
  dark: darkTheme,
  crt: crtTheme,
  modern: modernTheme,
};

const DEFAULT_THEME_ID = "pixel";
const STORAGE_KEY = "onyx.themeId";

interface ThemeContextValue {
  theme: Theme;
  themeId: string;
  setThemeId: (id: string) => void;
  themes: Theme[];
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a <ThemeProvider>");
  return ctx;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeId] = useState<string>(() => {
    if (typeof window === "undefined") return DEFAULT_THEME_ID;
    return localStorage.getItem(STORAGE_KEY) ?? DEFAULT_THEME_ID;
  });

  const theme = THEMES[themeId] ?? THEMES[DEFAULT_THEME_ID];

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, themeId);
  }, [themeId]);

  const css = useMemo(() => buildThemeCss(theme), [theme]);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, themeId, setThemeId, themes: Object.values(THEMES) }),
    [theme, themeId]
  );

  return (
    <ThemeContext.Provider value={value}>
      <style>{css}</style>
      {children}
    </ThemeContext.Provider>
  );
}

function buildThemeCss(theme: Theme): string {
  const c = theme.colors;
  const r = theme.radius;
  return `
    :root {
      --win-titlebar-active: ${c.titleBarActive};
      --win-titlebar-inactive: ${c.titleBarInactive};
      --win-titlebar-text: ${c.titleBarText};
      --win-titlebar-text-inactive: ${c.titleBarTextInactive};
      --win-face: ${c.windowFace};
      --win-face-light: ${c.windowFaceLight};
      --win-face-dark: ${c.windowFaceDark};
      --win-border: ${c.windowBorder};
      --win-desktop-bg: ${c.desktopBackground};
      --win-field-bg: ${c.fieldBackground};
      --win-text: ${c.text};
      --win-text-dim: ${c.textDim};
      --win-accent: ${c.accent};
      --win-success: ${c.success};
      --win-warning: ${c.warning};
      --win-danger: ${c.danger};
      --win-font-ui: ${theme.fonts.ui};
      --win-font-mono: ${theme.fonts.mono};
      --win-radius: ${r}px;
      --win-titlebar-h: ${TOKENS.window.titleBarHeight}px;
      --win-menubar-h: ${TOKENS.window.menuBarHeight}px;
      --win-toolbar-h: ${TOKENS.window.toolbarHeight}px;
    }

    .win-desktop {
      background: var(--win-desktop-bg);
      font-family: var(--win-font-ui);
      color: var(--win-text);
      position: relative;
      overflow: hidden;
    }

    .win-frame {
      background: var(--win-face);
      border-top: 2px solid #ffffff;
      border-left: 2px solid #ffffff;
      border-right: 2px solid #404040;
      border-bottom: 2px solid #404040;
      box-shadow: 1px 1px 0 #808080;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .win-titlebar {
      height: var(--win-titlebar-h);
      background: linear-gradient(90deg,#000080,#1084d0);
      color: white;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 6px;
      font-size: 11px;
      font-weight: bold;
      user-select: none;
      cursor: default;
      touch-action: none;
    }
    .win-titlebar.inactive {
      background: var(--win-titlebar-inactive);
      color: var(--win-titlebar-text-inactive);
    }

    .win-button {
      border-top: 2px solid #fff;
      border-left: 2px solid #fff;
      border-right: 2px solid #404040;
      border-bottom: 2px solid #404040;
      background: #c0c0c0;
      color: black;
      min-width: 18px;
      min-height: 18px;
      font-size: 10px;
      line-height: 1;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .win-button:active {
      border-top: 2px solid #404040;
      border-left: 2px solid #404040;
      border-right: 2px solid #fff;
      border-bottom: 2px solid #fff;
    }

    .win-menubar {
      height: 22px;
      background: #c0c0c0;
      border-top: 1px solid #fff;
      border-bottom: 1px solid #808080;
      display: flex;
      align-items: center;
      padding: 0 6px;
      font-size: 12px;
    }
    .win-menubar-item {
      padding: 2px 8px;
      cursor: default;
    }
    .win-menubar-item:hover, .win-menubar-item.open {
      background: var(--win-titlebar-active);
      color: var(--win-titlebar-text);
    }

    .win-toolbar {
      height: var(--win-toolbar-h);
      background: var(--win-face-light);
      border-bottom: 1px solid var(--win-face-dark);
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 0 6px;
    }

    .win-body {
      flex: 1;
      background: white;
      color: black;
      overflow: auto;
    }

    .no-scrollbar {
      scrollbar-width: none;
      -ms-overflow-style: none;
    }
    .no-scrollbar::-webkit-scrollbar {
      display: none;
    }

    .win-icon {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      width: 76px;
      padding: 6px 4px;
      cursor: default;
      user-select: none;
      border-radius: var(--win-radius);
    }
    .win-icon.selected {
    }
    .win-icon-label {
      font-size: 11px;
      color: var(--win-titlebar-text);
      text-align: center;
      text-shadow: 0 1px 2px rgba(0,0,0,0.6);
      line-height: 1.2;
    }

    .context-menu {
      background: var(--win-face);
      border: 1px solid var(--win-border);
      box-shadow: 2px 2px 4px rgba(0,0,0,0.4);
      min-width: 180px;
      font-size: 12px;
      padding: 2px;
    }
    .context-menu-item {
      padding: 5px 10px;
      cursor: default;
    }
    .context-menu-item:hover {
      background: var(--win-titlebar-active);
      color: var(--win-titlebar-text);
    }
    .context-menu-divider {
      height: 1px;
      background: var(--win-face-dark);
      margin: 3px 2px;
    }

    .win-toast {
      background: var(--win-face);
      border: 1px solid var(--win-border);
      box-shadow: 2px 2px 4px rgba(0,0,0,0.4);
      padding: 10px 14px;
      font-size: 12px;
      color: var(--win-text);
    }

    ${theme.scanlines ? SCANLINE_OVERLAY_CSS : ""}
  `;
}

const SCANLINE_OVERLAY_CSS = `
  .win-desktop::after {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: repeating-linear-gradient(
      0deg,
      rgba(0,0,0,0.15) 0px,
      rgba(0,0,0,0.15) 1px,
      transparent 1px,
      transparent 3px
    );
    mix-blend-mode: multiply;
  }
`;

export { TOKENS };
export type { Theme };
