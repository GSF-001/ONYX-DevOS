import { randomBytes, timingSafeEqual } from "node:crypto";
import type { FastifyRequest } from "fastify";
import { getCsrfCookieFromRequest } from "./cookies.js";

const CSRF_HEADER_NAME = "x-csrf-token";

export function generateCsrfToken(): string {
  return randomBytes(32).toString("hex");
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export function verifyCsrfToken(request: FastifyRequest): boolean {
  const cookieToken = getCsrfCookieFromRequest(request);
  const headerToken = request.headers[CSRF_HEADER_NAME];

  if (!cookieToken || !headerToken || typeof headerToken !== "string") return false;
  return safeEqual(cookieToken, headerToken);
}
