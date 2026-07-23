"use client";

import { cn } from "@/lib/cn";

/**
 * Underline tabs — §11.11. Active carries a 2px cyan underline. Never pill tabs
 * (pills are reserved for filters).
 */
export function Tabs<T extends string>({
  tabs,
  value,
  onChange,
  className,
}: {
  tabs: { value: T; label: string; count?: number }[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex gap-5 border-b border-line-200", className)} role="tablist">
      {tabs.map((tab) => {
        const active = tab.value === value;
        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.value)}
            className={cn(
              "relative flex h-11 items-center gap-2 type-body font-medium transition-colors duration-120",
              active ? "text-ink-700" : "text-ink-400 hover:text-ink-600",
            )}
          >
            {tab.label}
            {typeof tab.count === "number" && (
              <span className="type-data-sm text-ink-400">{tab.count}</span>
            )}
            {active && <span className="absolute inset-x-0 -bottom-px h-0.5 bg-cyan-600" />}
          </button>
        );
      })}
    </div>
  );
}
