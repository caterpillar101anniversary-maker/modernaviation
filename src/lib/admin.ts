import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/**
 * Admin gate — a single shared password, no accounts.
 *
 * The cookie never carries the password. It carries an HMAC derived from it,
 * so a stolen cookie doesn't reveal the secret, and changing ADMIN_PASSWORD
 * invalidates every existing session for free.
 */

const COOKIE = "mac_admin";
const SESSION_MESSAGE = "modern-aviation-admin-session";
/** Sessions are short by design — this is a back office, not a consumer app. */
const MAX_AGE_SECONDS = 60 * 60 * 12;

function adminPassword(): string | null {
  const value = process.env.ADMIN_PASSWORD;
  // An unset or empty password must lock the door, never open it.
  return value && value.length > 0 ? value : null;
}

/** Constant-time string compare that tolerates differing lengths. */
function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

function sessionToken(password: string): string {
  return createHmac("sha256", password).update(SESSION_MESSAGE).digest("hex");
}

/** True when the submitted password matches the configured one. */
export function checkPassword(submitted: string): boolean {
  const expected = adminPassword();
  if (!expected) return false;
  return safeEqual(submitted, expected);
}

export async function startAdminSession() {
  const password = adminPassword();
  if (!password) return;
  const store = await cookies();
  store.set(COOKIE, sessionToken(password), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function endAdminSession() {
  const store = await cookies();
  store.delete(COOKIE);
}

/** Whether the current request carries a valid admin session. */
export async function isAdmin(): Promise<boolean> {
  const password = adminPassword();
  if (!password) return false;
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return false;
  return safeEqual(token, sessionToken(password));
}

/** True when no ADMIN_PASSWORD is configured — the gate is closed, not open. */
export function adminPasswordMissing(): boolean {
  return adminPassword() === null;
}
