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

import { useReviewsData } from "./ReviewsHooks";
import { ReviewsWindow } from "./ReviewsWindow";
import "./ReviewsStyles.css";

export default function ReviewsApp() {
  const data = useReviewsData();
  return <ReviewsWindow data={data} />;
}
