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

const GITHUB_API_BASE = "https://api.github.com";

export class GitHubApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "GitHubApiError";
  }
}

export class GitHubClient {
  constructor(private accessToken: string) {}

  private async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const res = await fetch(`${GITHUB_API_BASE}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        ...init.headers,
      },
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new GitHubApiError(res.status, `GitHub API ${path} failed: ${res.status} ${body}`);
    }

    return res.json() as Promise<T>;
  }

  getAuthenticatedUser() {
    return this.request<{
      id: number;
      login: string;
      name: string | null;
      email: string | null;
      avatar_url: string;
    }>("/user");
  }

  listRepos() {
    return this.request<{
      id: number;
      name: string;
      full_name: string;
      owner: { login: string };
      private: boolean;
      default_branch: string;
    }[]>("/user/repos?per_page=100&sort=updated");
  }

  getRepo(owner: string, repo: string) {
    return this.request<{
      id: number;
      full_name: string;
      default_branch: string;
      private: boolean;
    }>(`/repos/${owner}/${repo}`);
  }

  listPullRequests(owner: string, repo: string, state: "open" | "closed" | "all" = "all") {
    return this.request<unknown[]>(
      `/repos/${owner}/${repo}/pulls?state=${state}&per_page=100`
    );
  }

  listPullRequestReviews(owner: string, repo: string, prNumber: number) {
    return this.request<unknown[]>(
      `/repos/${owner}/${repo}/pulls/${prNumber}/reviews?per_page=100`
    );
  }

  listIssues(owner: string, repo: string, state: "open" | "closed" | "all" = "all") {
    return this.request<unknown[]>(`/repos/${owner}/${repo}/issues?state=${state}&per_page=100`);
  }

  listCommits(owner: string, repo: string, since?: string) {
    const q = since ? `?since=${encodeURIComponent(since)}&per_page=100` : "?per_page=100";
    return this.request<unknown[]>(`/repos/${owner}/${repo}/commits${q}`);
  }

  listBranches(owner: string, repo: string) {
    return this.request<{
      name: string;
      commit: { sha: string };
      protected: boolean;
    }[]>(`/repos/${owner}/${repo}/branches?per_page=100`);
  }

  /** Commit history reachable from a given branch/ref, with full parent
   * hashes and author info — enough to build a real commit DAG. */
  listCommitsForRef(owner: string, repo: string, ref: string, perPage = 100) {
    return this.request<{
      sha: string;
      parents: { sha: string }[];
      commit: {
        message: string;
        author: { name: string; email: string; date: string };
      };
      author: { login: string } | null;
    }[]>(`/repos/${owner}/${repo}/commits?sha=${encodeURIComponent(ref)}&per_page=${perPage}`);
  }

  listCheckRunsForRef(owner: string, repo: string, ref: string) {
    return this.request<{ check_runs: unknown[] }>(
      `/repos/${owner}/${repo}/commits/${ref}/check-runs`
    );
  }
}

export function createGitHubClient(accessToken: string): GitHubClient {
  return new GitHubClient(accessToken);
}
