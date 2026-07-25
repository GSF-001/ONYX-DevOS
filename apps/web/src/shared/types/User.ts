/**
 * ONYX DevOS
 * Copyright (c) 2026 GSF-001
 * All rights reserved.
 */

export interface User {
  id: number;
  login: string;
  name: string | null;
  avatarUrl: string | null;
  email: string | null;
}
