"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Plane, ShieldCheck, Tag } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Mobile bottom tab bar (§11.3). 64px + safe-area inset, paper, top border,
 * four items. Active item: icon + label cyan-600, plus a 2px cyan bar 24px
 * wide at the top edge. Minimum tap target 48×48. Hidden on ≥1024px and on
 * the request wizard.
 */

const tabs = [
  { label: "Home", href: "/", icon: Home },
  { label: "Fleet", href: "/fleet", icon: Plane },
  { label: "Empty legs", href: "/empty-legs", icon: Tag },
  { label: "Safety", href: "/safety", icon: ShieldCheck },
];

export function BottomTabBar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line-200 bg-paper lg:hidden print:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="flex h-16 items-stretch">
        {tabs.map(({ label, href, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <li key={label} className="flex-1">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex h-full min-h-12 flex-col items-center justify-center gap-1",
                  active ? "text-cyan-600" : "text-ink-400",
                )}
              >
                {active && (
                  <span
                    aria-hidden
                    className="absolute top-0 h-0.5 w-6 rounded-pill bg-cyan-600"
                  />
                )}
                <Icon size={24} strokeWidth={1.5} aria-hidden />
                <span
                  className="font-semibold"
                  style={{ fontFamily: "var(--font-body)", fontSize: 10, lineHeight: "12px" }}
                >
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
