"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { setSession, clearSession } from "@/lib/session";

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export type AuthState = { error?: string };

/** Create an account from first name, last name, email; sign in on success. */
export async function createAccount(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  if (!firstName || !lastName) return { error: "Enter your first and last name." };
  if (!EMAIL.test(email)) return { error: "Enter a valid email address." };

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return { error: "An account with that email already exists. Sign in instead." };

  const user = await prisma.user.create({ data: { firstName, lastName, email } });
  await setSession(user.id);
  redirect("/account");
}

/** Sign in with first name + email (no secret — see lib/session note). */
export async function signIn(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const firstName = String(formData.get("firstName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  if (!firstName || !EMAIL.test(email)) return { error: "Enter your first name and email." };

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.firstName.toLowerCase() !== firstName.toLowerCase()) {
    return { error: "No account matches that first name and email. Check both, or create an account." };
  }

  await setSession(user.id);
  redirect("/account");
}

export async function signOut() {
  await clearSession();
  redirect("/");
}

/** Autofill helper for the booking wizard — looks up a returning user by email. */
export async function lookupUserByEmail(email: string) {
  const e = email.trim().toLowerCase();
  if (!EMAIL.test(e)) return null;
  try {
    const user = await prisma.user.findUnique({ where: { email: e } });
    return user ? { firstName: user.firstName, lastName: user.lastName } : null;
  } catch {
    return null;
  }
}
