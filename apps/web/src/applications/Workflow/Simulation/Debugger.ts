// Debugger.ts — drives runWorkflow() step by step, pausing at breakpoints and animating edges

import { workflowStore } from "../WorkflowStore";
import { runWorkflow, ExecutorEvent } from "./Executor";
import { breakpointManager } from "./Breakpoint";
import { WorkflowDocument } from "../WorkflowTypes";

type Mode = "idle" | "running" | "paused" | "stepping";

class DebuggerController {
  private mode: Mode = "idle";
  private generator: AsyncGenerator<ExecutorEvent, void, unknown> | null = null;
  private resumeResolver: (() => void) | null = null;
  private currentEdgeIds: string[] = [];

  private edgeIdsFor(doc: WorkflowDocument, sourceNodeId: string): string[] {
    return doc.edges.filter((e) => e.sourceNodeId === sourceNodeId).map((e) => e.id);
  }

  async start(): Promise<void> {
    if (this.mode === "running" || this.mode === "paused") return;
    const doc = workflowStore.getState().doc;
    this.generator = runWorkflow(doc, { timeScale: 20 });
    this.mode = "running";
    workflowStore.setExecutionStatus("running");
    workflowStore.log("info", `Execution started for "${doc.name}"`);
    void this.pump();
  }

  private async pump(): Promise<void> {
    if (!this.generator) return;
    while (this.mode === "running" || this.mode === "stepping") {
      const { value, done } = await this.generator.next();
      if (done) break;
      await this.handleEvent(value);
      if (this.mode === "stepping") {
        this.mode = "paused";
        workflowStore.setExecutionStatus("paused");
        break;
      }
    }
  }

  private async handleEvent(event: ExecutorEvent): Promise<void> {
    const doc = workflowStore.getState().doc;
    switch (event.type) {
      case "enter": {
        if (!event.nodeId) return;
        workflowStore.setActiveNode(event.nodeId);
        this.currentEdgeIds.forEach((id) => workflowStore.setEdgeAnimated(id, false));
        if (breakpointManager.has(event.nodeId)) {
          workflowStore.log("warn", `Breakpoint hit at node ${event.nodeId}`, event.nodeId);
          this.mode = "paused";
          workflowStore.setExecutionStatus("paused");
          await this.waitForResume();
        }
        return;
      }
      case "exit": {
        if (!event.nodeId) return;
        this.currentEdgeIds = this.edgeIdsFor(doc, event.nodeId);
        this.currentEdgeIds.forEach((id) => workflowStore.setEdgeAnimated(id, true));
        return;
      }
      case "log":
        workflowStore.log("debug", event.message ?? "", event.nodeId);
        return;
      case "variable":
        workflowStore.log("info", event.message ?? "", event.nodeId);
        return;
      case "error":
        workflowStore.log("error", event.message ?? "Unknown execution error", event.nodeId);
        this.mode = "idle";
        workflowStore.setExecutionStatus("errored");
        return;
      case "done":
        workflowStore.log("info", "Execution finished");
        this.mode = "idle";
        workflowStore.setActiveNode(null);
        workflowStore.setExecutionStatus("completed");
        return;
    }
  }

  private waitForResume(): Promise<void> {
    return new Promise((resolve) => {
      this.resumeResolver = resolve;
    });
  }

  resume(): void {
    if (this.mode !== "paused") return;
    this.mode = "running";
    workflowStore.setExecutionStatus("running");
    const resolve = this.resumeResolver;
    this.resumeResolver = null;
    resolve?.();
    void this.pump();
  }

  step(): void {
    if (this.mode === "idle") {
      void this.start();
      this.mode = "stepping";
      return;
    }
    if (this.mode === "paused") {
      this.mode = "stepping";
      const resolve = this.resumeResolver;
      this.resumeResolver = null;
      resolve?.();
      void this.pump();
    }
  }

  pause(): void {
    if (this.mode === "running") {
      this.mode = "paused";
      workflowStore.setExecutionStatus("paused");
    }
  }

  stop(): void {
    this.mode = "idle";
    this.generator = null;
    this.resumeResolver = null;
    this.currentEdgeIds.forEach((id) => workflowStore.setEdgeAnimated(id, false));
    this.currentEdgeIds = [];
    workflowStore.setActiveNode(null);
    workflowStore.setExecutionStatus("idle");
    workflowStore.log("info", "Execution stopped");
  }

  currentMode(): Mode {
    return this.mode;
  }
}

export const workflowDebugger = new DebuggerController();
