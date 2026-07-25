/**
 * ONYX DevOS — Developer Operating System
 * © 2026 GSF-001
 *
 * Proprietary Software.
 * Unauthorized use is strictly prohibited.
 */

// Executor.ts — walks the workflow graph and actually executes node semantics.
// Uses an async generator so the Debugger can step through frame-by-frame.

import {
  AnyWorkflowNode,
  ExecutionFrame,
  WorkflowDocument,
  WorkflowEdge,
  WorkflowVariable,
} from "../WorkflowTypes";

export type VariableBag = Record<string, string | number | boolean | Record<string, unknown>>;

export function docVariablesToBag(vars: WorkflowVariable[]): VariableBag {
  const bag: VariableBag = {};
  vars.forEach((v) => (bag[v.name] = v.value));
  return bag;
}

/**
 * Evaluates a JS boolean/number expression against the current variable bag.
 * Runs in a scoped Function — variables are the only names in scope besides globals.
 */
export function evaluateExpression(expr: string, bag: VariableBag): unknown {
  const keys = Object.keys(bag);
  const values = keys.map((k) => bag[k]);
  try {
    // eslint-disable-next-line no-new-func
    const fn = new Function(...keys, `"use strict"; return (${expr});`);
    return fn(...values);
  } catch (err) {
    throw new Error(`Expression error in "${expr}": ${(err as Error).message}`);
  }
}

export interface ExecutorEvent {
  type: "enter" | "exit" | "log" | "variable" | "done" | "error";
  nodeId?: string;
  message?: string;
  outcome?: ExecutionFrame["outcome"];
}

interface ExecutorOptions {
  timeScale?: number; // divides all durationMs/timeoutMs so simulation runs fast; default 20x speedup
  maxSteps?: number; // safety valve against infinite loops
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function pickOutgoing(edges: WorkflowEdge[], nodeId: string, condition?: "true" | "false" | "default"): WorkflowEdge | undefined {
  const outs = edges.filter((e) => e.sourceNodeId === nodeId);
  if (condition) {
    const match = outs.find((e) => e.condition === condition);
    if (match) return match;
  }
  return outs.find((e) => !e.condition) ?? outs[0];
}

export async function* runWorkflow(
  doc: WorkflowDocument,
  options: ExecutorOptions = {}
): AsyncGenerator<ExecutorEvent, void, unknown> {
  const timeScale = options.timeScale ?? 20;
  const maxSteps = options.maxSteps ?? 5000;
  const byId = new Map(doc.nodes.map((n) => [n.id, n]));
  const bag: VariableBag = docVariablesToBag(doc.variables);
  const mergeVisits = new Map<string, number>();
  const incomingCount = new Map<string, number>();
  doc.edges.forEach((e) => incomingCount.set(e.targetNodeId, (incomingCount.get(e.targetNodeId) ?? 0) + 1));

  const start = doc.nodes.find((n) => n.kind === "start");
  if (!start) {
    yield { type: "error", message: "No Start node found." };
    return;
  }

  let current: AnyWorkflowNode | undefined = start;
  let steps = 0;
  const loopIterations = new Map<string, number>();

  while (current && steps < maxSteps) {
    steps++;
    yield { type: "enter", nodeId: current.id };

    let outcome: ExecutionFrame["outcome"] = "default";

    try {
      switch (current.kind) {
        case "start": {
          break;
        }
        case "task": {
          const cfg = current.config as { action: string; timeoutMs: number; retries: number };
          let attempt = 0;
          let ok = false;
          while (attempt <= cfg.retries && !ok) {
            attempt++;
            yield { type: "log", nodeId: current.id, message: `Running "${cfg.action}" (attempt ${attempt})` };
            await wait(Math.min(cfg.timeoutMs, 4000) / timeScale);
            ok = true; // deterministic success — real integrations would report failure here
          }
          break;
        }
        case "delay": {
          const cfg = current.config as { durationMs: number };
          yield { type: "log", nodeId: current.id, message: `Waiting ${cfg.durationMs}ms` };
          await wait(cfg.durationMs / timeScale);
          break;
        }
        case "variable": {
          const cfg = current.config as { name: string; operation: "set" | "increment" | "append"; value: string };
          if (cfg.operation === "set") {
            bag[cfg.name] = coerce(cfg.value);
          } else if (cfg.operation === "increment") {
            const cur = Number(bag[cfg.name] ?? 0);
            bag[cfg.name] = cur + Number(cfg.value || 1);
          } else if (cfg.operation === "append") {
            bag[cfg.name] = String(bag[cfg.name] ?? "") + cfg.value;
          }
          yield { type: "variable", nodeId: current.id, message: `${cfg.name} = ${JSON.stringify(bag[cfg.name])}` };
          break;
        }
        case "branch": {
          const cfg = current.config as { condition: string };
          const result = Boolean(evaluateExpression(cfg.condition, bag));
          outcome = result ? "true" : "false";
          yield { type: "log", nodeId: current.id, message: `Branch condition -> ${result}` };
          break;
        }
        case "decision": {
          const cfg = current.config as { expression: string };
          const result = Boolean(evaluateExpression(cfg.expression, bag));
          outcome = result ? "true" : "false";
          yield { type: "log", nodeId: current.id, message: `Decision -> ${result}` };
          break;
        }
        case "loop": {
          const cfg = current.config as { condition: string; maxIterations: number };
          const iter = loopIterations.get(current.id) ?? 0;
          const conditionHolds = Boolean(evaluateExpression(cfg.condition, bag));
          const shouldContinue = conditionHolds && iter < cfg.maxIterations;
          loopIterations.set(current.id, iter + 1);
          outcome = shouldContinue ? "true" : "false";
          yield {
            type: "log",
            nodeId: current.id,
            message: `Loop iteration ${iter + 1}/${cfg.maxIterations} -> ${shouldContinue ? "continue" : "exit"}`,
          };
          break;
        }
        case "merge": {
          const cfg = current.config as { strategy: "all" | "any" };
          const need = incomingCount.get(current.id) ?? 1;
          const seen = (mergeVisits.get(current.id) ?? 0) + 1;
          mergeVisits.set(current.id, seen);
          if (cfg.strategy === "all" && seen < need) {
            yield { type: "log", nodeId: current.id, message: `Merge waiting (${seen}/${need} branches arrived)` };
            yield { type: "exit", nodeId: current.id, outcome: "default" };
            return; // pause this path; another incoming branch will complete the merge
          }
          break;
        }
        case "end": {
          const cfg = current.config as { status: "success" | "failure" | "neutral" };
          yield { type: "log", nodeId: current.id, message: `Workflow ended: ${cfg.status}` };
          yield { type: "exit", nodeId: current.id, outcome: "default" };
          yield { type: "done" };
          return;
        }
      }
    } catch (err) {
      yield { type: "error", nodeId: current.id, message: (err as Error).message };
      yield { type: "exit", nodeId: current.id, outcome: "error" };
      return;
    }

    yield { type: "exit", nodeId: current.id, outcome };

    const nextEdge = pickOutgoing(doc.edges, current.id, outcome);
    current = nextEdge ? byId.get(nextEdge.targetNodeId) : undefined;
  }

  if (steps >= maxSteps) {
    yield { type: "error", message: "Execution aborted: step limit exceeded (possible infinite loop)." };
    return;
  }
  yield { type: "done" };
}

function coerce(raw: string): string | number | boolean {
  if (raw === "true") return true;
  if (raw === "false") return false;
  const n = Number(raw);
  if (raw.trim() !== "" && !Number.isNaN(n)) return n;
  return raw;
}
