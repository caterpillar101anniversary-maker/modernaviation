import { cookies } from "next/headers";
import { prisma } from "@/lib/db";

/**
 * Minimal cookie session. The cookie holds the user id (httpOnly). Note: sign-in
 * is first-name + email with no password/secret — convenient for now but NOT
 * real authentication. Harden before real customers (email code, or a password).
 */
const COOKIE = "mac_session";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

/** Read-safe: never throws if the DB is unreachable — returns null instead. */
export async function getSessionUser() {
  try {
    const store = await cookies();
    const id = store.get(COOKIE)?.value;
    if (!id) return null;
    return await prisma.user.findUnique({ where: { id } });
  } catch {
    return null;
  }
}

export async function setSession(userId: string) {
  const store = await cookies();
  store.set(COOKIE, userId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function clearSession() {
  const store = await cookies();
  store.delete(COOKIE);
}
