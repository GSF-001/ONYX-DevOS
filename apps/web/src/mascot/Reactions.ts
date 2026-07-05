import type { MascotExpression } from "./Expressions";

/** Maps an ONYX health/activity score (0-100) to a mascot expression. */
export function expressionForScore(score: number): MascotExpression {
  if (score >= 75) return "happy";
  if (score >= 45) return "idle";
  if (score >= 20) return "warning";
  return "error";
}

/** Maps how long the desktop has been idle (ms) to an expression. */
export function expressionForIdleTime(idleMs: number): MascotExpression {
  if (idleMs > 5 * 60 * 1000) return "sleeping";
  if (idleMs > 60 * 1000) return "idle";
  return "happy";
}

export function expressionForError(): MascotExpression {
  return "error";
}

export function expressionForSpeaking(): MascotExpression {
  return "talking";
}
