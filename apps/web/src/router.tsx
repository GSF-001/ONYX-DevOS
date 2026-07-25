/**
 * ONYX DevOS
 * Copyright (c) 2026 GSF-001
 * All rights reserved.
 */

import { createBrowserRouter, redirect } from "react-router-dom";
import App from "./App";
import { getCurrentUser, getMyTeams } from "./shared/api";

async function requireSession() {
  const user = await getCurrentUser().catch(() => null);
  if (!user) throw redirect("/");
  return user;
}

async function requireWorkspace() {
  const user = await requireSession();
  const teams = await getMyTeams().catch(() => []);
  if (teams.length === 0) throw redirect("/create-workspace");
  return { user, teams };
}

async function requireRepository() {
  const { user, teams } = await requireWorkspace();
  const { getDashboard } = await import("./shared/api");
  const dashboard = await getDashboard(teams[0].team.slug).catch(() => null);
  if (!dashboard || dashboard.repositories.length === 0) throw redirect("/repository-setup");
  return { user, teams };
}

async function redirectIfAuthenticated() {
  const user = await getCurrentUser().catch(() => null);
  if (user) throw redirect("/boot");
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
          const { LandingPage } = await import("./landing");
          return { Component: LandingPage };
        },
      },
      {
        path: "features",
        lazy: async () => {
          const { FeaturesPage } = await import("./pages/FeaturesPage");
          return { Component: FeaturesPage };
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
        path: "create-workspace",
        loader: requireSession,
        lazy: async () => {
          const { CreateWorkspacePage } = await import("./workspace-setup/CreateWorkspacePage");
          return { Component: CreateWorkspacePage };
        },
      },
      {
        path: "repository-setup",
        loader: requireWorkspace,
        lazy: async () => {
          const { RepositorySetupPage } = await import("./workspace-setup/RepositorySetupPage");
          return { Component: RepositorySetupPage };
        },
      },
      {
        path: "boot",
        loader: requireRepository,
        lazy: async () => {
          const { BootScreen } = await import("./boot");
          return { Component: BootScreen };
        },
      },
      {
        path: "desktop",
        loader: requireRepository,
        lazy: async () => {
          const { DesktopPage } = await import("./pages/DesktopPage");
          return { Component: DesktopPage };
        },
      },
      {
        path: "shutdown",
        loader: requireRepository,
        lazy: async () => {
          const { ShutdownScreen } = await import("./boot");
          return { Component: ShutdownScreen };
        },
      },
      {
        path: "restart",
        loader: requireRepository,
        lazy: async () => {
          const { RestartScreen } = await import("./boot");
          return { Component: RestartScreen };
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
