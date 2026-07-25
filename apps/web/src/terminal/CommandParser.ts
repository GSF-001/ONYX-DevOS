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

export interface ParsedCommand {
  name: string;
  args: string[];
  raw: string;
}

/** Splits a raw input line into command name + args, respecting quoted
 * segments ("open pull requests" stays one arg if quoted). */
export function parseCommandLine(input: string): ParsedCommand | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const tokens: string[] = [];
  const regex = /"([^"]*)"|(\S+)/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(trimmed)) !== null) {
    tokens.push(match[1] ?? match[2]);
  }

  const [name, ...args] = tokens;
  return { name: name.toLowerCase(), args, raw: trimmed };
}
