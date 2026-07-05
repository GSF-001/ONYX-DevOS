import { useSyncExternalStore } from "react";
import type { User } from "../shared/types";
import { getCurrentUser } from "../shared/api";

type Listener = () => void;

let currentUser: User | null = null;
let status: "idle" | "loading" | "loaded" = "idle";
const listeners = new Set<Listener>();

function emit(): void {
  for (const listener of listeners) listener();
}

/** Minimal external store (no dependency needed) so multiple components
 * can read the same auth state without prop-drilling or re-fetching. */
export function getAuthUser(): User | null {
  return currentUser;
}

export function getAuthStatus(): typeof status {
  return status;
}

export function setAuthUser(user: User | null): void {
  currentUser = user;
  status = "loaded";
  emit();
}

export function subscribeAuth(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Fetches /auth/me once and populates the store; safe to call repeatedly —
 * subsequent calls while already loading are no-ops. */
export async function loadAuthUser(): Promise<User | null> {
  if (status === "loading") return currentUser;
  status = "loading";
  emit();

  try {
    const user = await getCurrentUser();
    setAuthUser(user);
    return user;
  } catch {
    currentUser = null;
    status = "loaded";
    emit();
    return null;
  }
}

export function useAuthUser(): { user: User | null; status: typeof status } {
  const user = useSyncExternalStore(subscribeAuth, getAuthUser);
  const currentStatus = useSyncExternalStore(subscribeAuth, getAuthStatus);
  return { user, status: currentStatus };
}
