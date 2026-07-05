import { useEffect, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthUser, loadAuthUser } from "./AuthState";
import { LoadingSpinner } from "../shared/components";

interface AuthGuardProps {
  children: ReactNode;
  redirectTo?: string;
}

/**
 * Client-side guard for subtrees mounted outside the router's own
 * loader-based checks (e.g. a window opened inside the desktop that wants
 * to double-check auth state reactively, not just once on route entry).
 */
export function AuthGuard({ children, redirectTo = "/" }: AuthGuardProps) {
  const { user, status } = useAuthUser();

  useEffect(() => {
    if (status === "idle") void loadAuthUser();
  }, [status]);

  if (status === "idle" || status === "loading") {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: 48 }}>
        <LoadingSpinner label="Checking session..." />
      </div>
    );
  }

  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}
