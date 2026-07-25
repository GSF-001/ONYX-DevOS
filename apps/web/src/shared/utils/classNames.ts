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

type ClassValue = string | number | false | null | undefined | Record<string, boolean>;

/**
 * Minimal clsx-style class name merger — avoids pulling in a dependency for
 * something this small.
 */
export function cn(...values: ClassValue[]): string {
  const classes: string[] = [];

  for (const value of values) {
    if (!value) continue;

    if (typeof value === "string" || typeof value === "number") {
      classes.push(String(value));
      continue;
    }

    for (const [key, enabled] of Object.entries(value)) {
      if (enabled) classes.push(key);
    }
  }

  return classes.join(" ");
}
