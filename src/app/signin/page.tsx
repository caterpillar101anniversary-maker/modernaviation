"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Wordmark } from "@/components/layout/Wordmark";
import { Button } from "@/components/primitives/Button";
import { TextField } from "@/components/primitives/Field";

export default function SignInPage() {
  const [stage, setStage] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const setDigit = (i: number, v: string) => {
    const digit = v.replace(/\D/g, "").slice(-1);
    setCode((c) => c.map((x, idx) => (idx === i ? digit : x)));
    if (digit && i < 5) inputs.current[i + 1]?.focus();
  };

  const onPaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (text) {
      e.preventDefault();
      setCode(text.padEnd(6, "").split("").slice(0, 6).map((c) => c || ""));
      inputs.current[Math.min(text.length, 5)]?.focus();
    }
  };

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-haze-100 px-5 py-16">
      <Link href="/" aria-label="Modern Aviation CLT home" className="mb-8 rounded-control">
        <Wordmark />
      </Link>

      <div className="w-full max-w-100 rounded-card border border-line-200 bg-paper p-8">
        {stage === "email" ? (
          <>
            <h1 className="type-h2 text-ink-700">Sign in</h1>
            <p className="mt-2 type-body-sm text-ink-400">
              Enter your email and we&apos;ll send a six-digit code. No password.
            </p>
            <form
              className="mt-6 flex flex-col gap-5"
              onSubmit={(e) => {
                e.preventDefault();
                if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) setStage("code");
              }}
            >
              <TextField label="Email" type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} autoFocus />
              <Button type="submit" size="lg" className="w-full">Send code</Button>
            </form>
          </>
        ) : (
          <>
            <h1 className="type-h2 text-ink-700">Enter your code</h1>
            <p className="mt-2 type-body-sm text-ink-400">
              We sent a six-digit code to <span className="text-ink-700">{email}</span>.
            </p>
            <div className="mt-6 flex justify-between gap-2" onPaste={onPaste}>
              {code.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { inputs.current[i] = el; }}
                  value={digit}
                  onChange={(e) => setDigit(i, e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Backspace" && !digit && i > 0) inputs.current[i - 1]?.focus(); }}
                  inputMode="numeric"
                  maxLength={1}
                  aria-label={`Digit ${i + 1}`}
                  className="h-13 w-13 rounded-control border border-line-300 bg-paper text-center type-data-lg text-ink-700 focus-visible:border-cyan-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
                />
              ))}
            </div>
            <Button asChild size="lg" className="mt-6 w-full">
              <Link href="/account">Verify and continue</Link>
            </Button>
            <button type="button" onClick={() => setStage("email")} className="mt-4 w-full rounded-control type-body-sm font-semibold text-cyan-600 hover:text-cyan-500">
              Use a different email
            </button>
          </>
        )}
      </div>
    </div>
  );
}
