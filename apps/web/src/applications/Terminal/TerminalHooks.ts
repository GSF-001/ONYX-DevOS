/**
 * The real session state machine (console lines, input, key handling)
 * lives in terminal/Terminal.tsx as a self-contained component rather
 * than a standalone hook, since nothing else in the app needs to drive a
 * terminal session. This file re-exports that component directly so
 * TerminalWindow.tsx has a hook-shaped import to use, per convention.
 */
export { default as useTerminalComponent } from "../../terminal/Terminal";
