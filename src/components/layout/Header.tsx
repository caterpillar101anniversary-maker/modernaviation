"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/primitives/Button";
import { Wordmark } from "@/components/layout/Wordmark";
import { brand } from "@/config/brand";

const navItems = [
  { label: "Fleet", href: "/fleet" },
  { label: "Empty legs", href: "/empty-legs" },
  { label: "Safety", href: "/safety" },
  { label: "How it works", href: "/#how-it-works" },
];

const MENU_ID = "primary-menu";

/** In-page anchors never count as the active section. */
function isActive(href: string, pathname: string) {
  return (
    href.startsWith("/") && !href.includes("#") && pathname.startsWith(href)
  );
}

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Navigating closes the menu — the same route can re-render without unmounting.
  useEffect(() => setMenuOpen(false), [pathname]);

  // An open menu shouldn't scroll the page behind it.
  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [menuOpen]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 bg-paper border-b border-line-200 transition-shadow duration-200 ease-out print:hidden",
        scrolled && "shadow-raised",
      )}
    >
      <div className="mx-auto flex h-14 max-w-320 items-center justify-between px-5 sm:px-6 lg:h-18 lg:px-10">
        <Link
          href="/"
          aria-label="Modern Aviation CLT home"
          className="rounded-control"
        >
          <Wordmark />
        </Link>

        {/* Desktop navigation (≥1024px) */}
        <nav
          className="hidden lg:flex lg:items-center lg:gap-8"
          aria-label="Primary"
        >
          {navItems.map((item) => {
            const active = isActive(item.href, pathname);
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

        {/* Desktop actions — no accounts, so the phone is the second route in. */}
        <div className="hidden lg:flex lg:items-center lg:gap-2">
          {/* <Button asChild variant="ghost">
            <a href={brand.phoneHref}>{brand.phoneDisplay}</a>
          </Button> */}
          <Button asChild variant="primary">
            <Link href="/request">Request a quote</Link>
          </Button>
        </div>

        {/* Mobile — wordmark and a hamburger, nothing else. */}
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-controls={MENU_ID}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="-mr-2 grid h-12 w-12 place-items-center rounded-control text-ink-700 transition-colors duration-120 hover:bg-haze-050 lg:hidden"
        >
          {menuOpen ? (
            <X size={24} strokeWidth={1.5} aria-hidden />
          ) : (
            <Menu size={24} strokeWidth={1.5} aria-hidden />
          )}
        </button>
      </div>

      {/* Collapsed desktop navigation — the same destinations, in the same
          order, plus the actions that sit beside the desktop nav. */}
      {menuOpen && (
        <nav
          id={MENU_ID}
          aria-label="Primary"
          className="border-t border-line-200 bg-paper lg:hidden"
        >
          <ul className="flex flex-col px-5 py-2 sm:px-6">
            {navItems.map((item) => {
              const active = isActive(item.href, pathname);
              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex min-h-12 items-center border-b border-line-200 type-body transition-colors duration-120",
                      active ? "text-ink-700" : "text-ink-600",
                    )}
                  >
                    {active && (
                      <span
                        aria-hidden
                        className="mr-3 block h-4 w-px"
                        style={{ background: "var(--color-course-500)" }}
                      />
                    )}
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex flex-col gap-3 px-5 pb-5 pt-3 sm:px-6">
            <Button asChild variant="primary" size="lg">
              <Link href="/request">Request a quote</Link>
            </Button>
            {/* <Button asChild variant="ghost">
              <a href={brand.phoneHref}>{brand.phoneDisplay}</a>
            </Button> */}
          </div>
        </nav>
      )}
    </header>
  );
}
