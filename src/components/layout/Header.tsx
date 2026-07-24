"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/primitives/Button";
import { Wordmark } from "@/components/layout/Wordmark";
import { signOut } from "@/app/actions/auth";

const navItems = [
  { label: "Fleet", href: "/fleet" },
  { label: "Empty legs", href: "/empty-legs" },
  { label: "Safety", href: "/safety" },
  { label: "How it works", href: "/#how-it-works" },
];

export function Header({ user }: { user?: { firstName: string } | null }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 bg-paper border-b border-line-200 transition-shadow duration-200 ease-out print:hidden",
        scrolled && "shadow-raised",
      )}
    >
      <div className="mx-auto flex h-14 max-w-320 items-center justify-between px-5 sm:px-6 lg:h-18 lg:px-10">
        <Link href="/" aria-label="Modern Aviation CLT home" className="rounded-control">
          <Wordmark />
        </Link>

        {/* Desktop navigation (≥1024px) */}
        <nav className="hidden lg:flex lg:items-center lg:gap-8" aria-label="Primary">
          {navItems.map((item) => {
            const active =
              item.href.startsWith("/") &&
              !item.href.includes("#") &&
              pathname.startsWith(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                className="relative rounded-control type-body text-ink-600 transition-colors duration-120 hover:text-ink-700"
              >
                {item.label}
                {/* CL-4 — active nav item carries a 1px magenta underline, 6px below. */}
                {active && (
                  <span
                    aria-hidden
                    className="absolute left-0 top-full mt-1.5 block h-px w-full"
                    style={{ background: "var(--color-course-500)" }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop actions */}
        <div className="hidden lg:flex lg:items-center lg:gap-2">
          {user ? (
            <>
              <Button asChild variant="ghost">
                <Link href="/account">Hi, {user.firstName}</Link>
              </Button>
              <form action={signOut}>
                <Button type="submit" variant="secondary">Sign out</Button>
              </form>
            </>
          ) : (
            <>
              <Button asChild variant="ghost">
                <Link href="/signin">Sign in</Link>
              </Button>
              <Button asChild variant="primary">
                <Link href="/create-account">Create account</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile action — a single Primary (§11.3) */}
        <div className="lg:hidden">
          <Button asChild variant="primary" size="sm">
            <Link href={user ? "/account" : "/create-account"}>{user ? "Account" : "Sign up"}</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
