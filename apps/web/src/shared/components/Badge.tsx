import type { ReactNode } from "react";
import { cn } from "../utils/classNames";

type BadgeTone = "neutral" | "good" | "warn" | "danger" | "accent";

interface BadgeProps {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
}

const TONE_COLORS: Record<BadgeTone, { bg: string; fg: string }> = {
  neutral: { bg: "rgba(139,152,163,0.15)", fg: "var(--color-text-dim)" },
  good: { bg: "rgba(79,209,174,0.15)", fg: "var(--color-good)" },
  warn: { bg: "rgba(224,167,71,0.15)", fg: "var(--color-warn)" },
  danger: { bg: "rgba(224,104,95,0.15)", fg: "var(--color-danger)" },
  accent: { bg: "rgba(79,209,174,0.15)", fg: "var(--color-accent)" },
};

export function Badge({ children, tone = "neutral", className }: BadgeProps) {
  const colors = TONE_COLORS[tone];

  return (
    <span
      className={cn("badge", className)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "2px 8px",
        borderRadius: "var(--radius-sm)",
        fontSize: 12,
        fontWeight: 600,
        fontFamily: "var(--font-display)",
        background: colors.bg,
        color: colors.fg,
        lineHeight: 1.6,
      }}
    >
      {children}
    </span>
  );
}
