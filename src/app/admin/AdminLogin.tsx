"use client";

import { useActionState } from "react";
import { Button } from "@/components/primitives/Button";
import { TextField } from "@/components/primitives/Field";
import { adminSignIn, type AdminAuthState } from "@/app/actions/admin";

export function AdminLogin({ configured }: { configured: boolean }) {
  const [state, action, pending] = useActionState<AdminAuthState, FormData>(adminSignIn, {});

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-haze-100 px-5 py-16">
      <div className="w-full max-w-100 rounded-card border border-line-200 bg-paper p-8">
        <p className="type-label text-ink-400">Modern Aviation CLT</p>
        <h1 className="mt-2 type-h2 text-ink-700">Admin</h1>
        <p className="mt-2 type-body-sm text-ink-400">
          Enter the admin password to view flight requests.
        </p>

        {!configured && (
          <div className="mt-6 rounded-control border border-warn-600 bg-warn-050 px-4 py-3">
            <p className="type-body-sm text-warn-600">
              No <code>ADMIN_PASSWORD</code> is set on the server, so sign-in is disabled. Set it in
              the environment and restart.
            </p>
          </div>
        )}

        {state.error && (
          <div className="mt-6 rounded-control border border-stop-600 bg-stop-050 px-4 py-3" role="alert">
            <p className="type-body-sm text-stop-600">{state.error}</p>
          </div>
        )}

        <form action={action} className="mt-6 flex flex-col gap-5">
          <TextField
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
          <Button type="submit" size="lg" className="w-full" disabled={pending || !configured}>
            {pending ? "Checking…" : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  );
}
