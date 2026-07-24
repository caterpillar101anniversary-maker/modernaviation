"use server";

import { redirect } from "next/navigation";
import { checkPassword, endAdminSession, startAdminSession } from "@/lib/admin";

export type AdminAuthState = { error?: string };

export async function adminSignIn(
  _prev: AdminAuthState,
  formData: FormData,
): Promise<AdminAuthState> {
  const password = String(formData.get("password") ?? "");
  if (!password) return { error: "Enter the admin password." };
  // One generic message either way — never reveal whether a password is set.
  if (!checkPassword(password)) return { error: "Incorrect password." };

  await startAdminSession();
  redirect("/admin");
}

export async function adminSignOut() {
  await endAdminSession();
  redirect("/admin");
}
