/**
 * Public entry point for the internal GitHub write-actions library.
 *
 * This module is consumed by routes, workflow engines, and automation
 * jobs. It does not run standalone and does not perform its own
 * authentication — every function requires a `GithubActorContext`
 * (githubToken, userId, githubLogin) resolved by the caller's existing
 * auth module.
 *
 * Example:
 *
 *   import { pullRequests } from "./actions";
 *
 *   const actor = {
 *     githubToken: session.githubAccessToken,
 *     userId: session.userId,
 *     githubLogin: session.githubLogin,
 *   };
 *
 *   await pullRequests.approvePullRequest(actor, { owner: "acme", repo: "web", pullNumber: 42 });
 */
export * as pullRequests from "./pullRequests";
export * as issues from "./issues";
export * as repository from "./repository";
export * as releases from "./releases";
export * from "./shared";
