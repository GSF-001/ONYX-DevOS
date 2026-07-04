import type { FastifyReply, FastifyRequest } from "fastify";

const isProd = process.env.NODE_ENV === "production";

export const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME ?? "session_token";
export const CSRF_COOKIE_NAME = process.env.CSRF_COOKIE_NAME ?? "csrf_token";

const baseCookieOptions = {
  path: "/",
  httpOnly: true,
  secure: isProd,
  sameSite: "lax" as const,
  domain: process.env.COOKIE_DOMAIN,
};

export function setSessionCookie(reply: FastifyReply, token: string, maxAgeSeconds: number) {
  reply.setCookie(SESSION_COOKIE_NAME, token, {
    ...baseCookieOptions,
    maxAge: maxAgeSeconds,
  });
}

export function clearSessionCookie(reply: FastifyReply) {
  reply.clearCookie(SESSION_COOKIE_NAME, { path: "/" });
}

export function setCsrfCookie(reply: FastifyReply, token: string) {
  reply.setCookie(CSRF_COOKIE_NAME, token, {
    ...baseCookieOptions,
    httpOnly: false,
  });
}

export function getSessionTokenFromRequest(request: FastifyRequest): string | undefined {
  return request.cookies[SESSION_COOKIE_NAME];
}

export function getCsrfCookieFromRequest(request: FastifyRequest): string | undefined {
  return request.cookies[CSRF_COOKIE_NAME];
}
