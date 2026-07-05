import { createBrowserRouter, redirect } from "react-router-dom";
import App from "./App";
import { getCurrentUser } from "./shared/api";

/**
 * Enforced flow: landing -> auth -> boot -> desktop.
 *
 * - "landing" is public.
 * - "auth" kicks off the GitHub OAuth redirect; it doesn't render a page
 *   the user lingers on.
 * - "boot" and everything under "desktop" require a valid session. Anyone
 *   hitting those URLs directly without one is bounced back to "landing".
 * - Anyone who already has a session hitting "landing" or "auth" again is
 *   forwarded straight to "boot", so people don't re-see the marketing page
 *   after signing in.
 *
 * Page components (Landing, Boot, Desktop and its sub-apps) are expected at
 * ./pages/* and ./desktop/applications/* — this file only owns the flow.
 */

async function requireSession() {
  const user = await getCurrentUser().catch(() => null);
  if (!user) {
    throw redirect("/");
  }
  return user;
}

async function redirectIfAuthenticated() {
  const user = await getCurrentUser().catch(() => null);
  if (user) {
    throw redirect("/boot");
  }
  return null;
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        loader: redirectIfAuthenticated,
        lazy: async () => {
          const { LandingPage } = await import("./pages/LandingPage");
          return { Component: LandingPage };
        },
      },
      {
        path: "auth/github",
        loader: () => {
          window.location.href = `${import.meta.env.VITE_API_URL}/auth/github`;
          return null;
        },
        lazy: async () => {
          const { RedirectingPage } = await import("./pages/RedirectingPage");
          return { Component: RedirectingPage };
        },
      },
      {
        path: "boot",
        loader: requireSession,
        lazy: async () => {
          const { BootPage } = await import("./pages/BootPage");
          return { Component: BootPage };
        },
      },
      {
        path: "desktop",
        loader: requireSession,
        lazy: async () => {
          const { DesktopPage } = await import("./pages/DesktopPage");
          return { Component: DesktopPage };
        },
      },
      {
        path: "*",
        lazy: async () => {
          const { NotFoundPage } = await import("./pages/NotFoundPage");
          return { Component: NotFoundPage };
        },
      },
    ],
  },
]);
