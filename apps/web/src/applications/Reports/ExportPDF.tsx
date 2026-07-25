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

import { EmptyState } from "../../shared/components";

/**
 * Honest gap: the backend's export service (services/exports.ts) only
 * writes .csv/.json — there's no PDF generation. Rather than fake a PDF
 * download link, this says so plainly.
 */
export function ExportPDF() {
  return (
    <EmptyState
      title="PDF export isn't implemented yet"
      description="The server only generates CSV and JSON exports (see services/exports.ts). Adding PDF would need a rendering step on the backend."
    />
  );
}
