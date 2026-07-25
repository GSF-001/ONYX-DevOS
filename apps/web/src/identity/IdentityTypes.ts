/**
 * ONYX DevOS
 * Copyright (c) 2026 GSF-001
 * All rights reserved.
 */

export type Gender = "male" | "female";

export interface IdentityData {
  handle: string;
  developerId: string;
  gender: Gender;
  createdAt: string;
  lastChangedAt: string;
}

export interface CooldownStatus {
  canChange: boolean;
  nextChangeAt: string | null;
}
