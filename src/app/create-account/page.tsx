"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Wordmark } from "@/components/layout/Wordmark";
import { Button } from "@/components/primitives/Button";
import { TextField } from "@/components/primitives/Field";
import { createAccount, type AuthState } from "@/app/actions/auth";

export default function CreateAccountPage() {
  const [state, action, pending] = useActionState<AuthState, FormData>(createAccount, {});

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-haze-100 px-5 py-16">
      <Link href="/" aria-label="Modern Aviation CLT home" className="mb-8 rounded-control">
        <Wordmark />
      </Link>

      <div className="w-full max-w-100 rounded-card border border-line-200 bg-paper p-8">
        <h1 className="type-h2 text-ink-700">Create your account</h1>
        <p className="mt-2 type-body-sm text-ink-400">
          Your name and email speed up every future booking. No password.
        </p>

        {state.error && (
          <div className="mt-6 rounded-control border border-stop-600 bg-stop-050 px-4 py-3" role="alert">
            <p className="type-body-sm text-stop-600">{state.error}</p>
          </div>
        )}

        <form action={action} className="mt-6 flex flex-col gap-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField label="First name" name="firstName" autoComplete="given-name" required />
            <TextField label="Last name" name="lastName" autoComplete="family-name" required />
          </div>
          <TextField label="Email" name="email" type="email" placeholder="you@company.com" autoComplete="email" required />
          <Button type="submit" size="lg" className="w-full" disabled={pending}>
            {pending ? "Creating account…" : "Create account"}
          </Button>
        </form>

        <p className="mt-6 type-body-sm text-ink-400">
          Already have an account?{" "}
          <Link href="/signin" className="font-semibold text-cyan-600 hover:text-cyan-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
