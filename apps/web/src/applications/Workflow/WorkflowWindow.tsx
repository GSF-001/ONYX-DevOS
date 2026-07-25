// WorkflowWindow.tsx — registers the Workflow app as a desktop window in ONYX DevOS
//
// Usage in WindowRegistry.ts:
//   import { WorkflowWindowDefinition } from "./apps/Workflow/WorkflowWindow";
//   WINDOW_REGISTRY["workflow"] = WorkflowWindowDefinition;

import React from "react";
import { WorkflowApp } from "./WorkflowApp";

export interface WindowDefinition {
  id: string;
  title: string;
  icon: string;
  defaultSize: { width: number; height: number };
  minSize: { width: number; height: number };
  component: React.ComponentType;
}

export const WorkflowWindowDefinition: WindowDefinition = {
  id: "workflow",
  title: "Workflow — Git Graph Automation",
  icon: "workflow.png",
  defaultSize: { width: 980, height: 620 },
  minSize: { width: 640, height: 420 },
  component: WorkflowApp,
};

export function WorkflowWindow() {
  return <WorkflowApp />;
}
