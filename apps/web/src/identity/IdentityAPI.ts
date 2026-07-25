/**
 * ONYX DevOS
 * Copyright (c) 2026 GSF-001
 * All rights reserved.
 */

import { apiClient } from "../shared/api";
import type { CooldownStatus, Gender, IdentityData } from "./IdentityTypes";

export interface IdentityStats {
  reviewsGiven: number;
  commitsPushed: number;
  repositoriesConnected: number;
}

export const IdentityAPI = {
  getMe: () => apiClient.get<IdentityData>("/identity/me"),
  getCandidates: () => apiClient.get<string[]>("/identity/candidates"),
  getCooldown: () => apiClient.get<CooldownStatus>("/identity/cooldown"),
  getStats: () => apiClient.get<IdentityStats>("/identity/stats"),
  confirm: (handle: string, gender: Gender) =>
    apiClient.post<{ handle: string; developerId: string; gender: Gender }>("/identity/confirm", {
      handle,
      gender,
    }),
};
