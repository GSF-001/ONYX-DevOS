import type { WindowInstance } from "../window-manager/WindowContext";

export interface NamedWorkspace {
  name: string;
  windows: WindowInstance[];
  savedAt: string;
}

const STORAGE_KEY = "onyx.workspaces";

/** Multiple named workspaces (e.g. "Monday Workspace", "Deep Review Mode"),
 * layered on top of window-manager/WindowPersistence.ts's single
 * autosave slot — that one is "last state", these are explicit saves the
 * person names and picks between. */
export function listWorkspaces(): NamedWorkspace[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as NamedWorkspace[];
  } catch {
    return [];
  }
}

export function getWorkspace(name: string): NamedWorkspace | null {
  return listWorkspaces().find((w) => w.name === name) ?? null;
}

export function upsertWorkspace(workspace: NamedWorkspace): void {
  const others = listWorkspaces().filter((w) => w.name !== workspace.name);
  localStorage.setItem(STORAGE_KEY, JSON.stringify([workspace, ...others].slice(0, 20)));
}

export function deleteWorkspace(name: string): void {
  const remaining = listWorkspaces().filter((w) => w.name !== name);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(remaining));
}
