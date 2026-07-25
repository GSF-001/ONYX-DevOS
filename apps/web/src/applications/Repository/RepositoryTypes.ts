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

import type { Repository } from "../../shared/types";
import type { BusFactorResult } from "../../shared/api/endpoints";

export interface RepositoryViewState {
  repository: Repository | null;
  contributors: BusFactorResult["contributions"];
  loading: boolean;
  error: string | null;
}

export type { Repository };
