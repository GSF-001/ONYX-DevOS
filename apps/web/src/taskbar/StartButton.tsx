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

interface StartButtonProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function StartButton({ isOpen, onToggle }: StartButtonProps) {
  return (
    <button
      onClick={onToggle}
      className="win-button"
      style={{
        height: "100%",
        width: "auto",
        padding: "0 12px",
        fontWeight: 700,
        fontSize: 12,
        background: isOpen ? "var(--win-titlebar-active)" : "var(--win-face)",
        color: isOpen ? "var(--win-titlebar-text)" : "var(--win-text)",
      }}
    >
      ⊞ Start
    </button>
  );
}
