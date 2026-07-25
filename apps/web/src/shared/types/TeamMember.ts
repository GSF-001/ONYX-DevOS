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

export type TeamRole = "owner" | "admin" | "member";

export interface TeamMember {
  id: number;
  teamId: number;
  userId: number;
  role: TeamRole;
  createdAt: string;
}

export interface Team {
  id: number;
  name: string;
  slug: string;
}
