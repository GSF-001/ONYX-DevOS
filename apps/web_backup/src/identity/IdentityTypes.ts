/**
 * ONYX DevOS
 * Copyright (c) 2026 GSF-001
 * All rights reserved.
 */

export interface IdentityData {
  handle: string;
  developerId: string;
  createdAt: string;
  lastChangedAt: string;
}

export interface CooldownStatus {
  canChange: boolean;
  nextChangeAt: string | null;
}
