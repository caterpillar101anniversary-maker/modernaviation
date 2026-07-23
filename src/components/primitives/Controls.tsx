"use client";

import { Check, Minus, Plus } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/* ── Segmented control (trip type, flexibility) — §12.3 ── */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}) {
  return (
    <div
      role="radiogroup"
      className={cn("inline-flex w-full gap-1 rounded-control border border-line-200 bg-haze-100 p-1", className)}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.value)}
            className={cn(
              "flex-1 rounded-control px-3 py-2 type-body font-semibold transition-colors duration-120",
              active ? "bg-paper text-ink-700 shadow-raised" : "text-ink-400 hover:text-ink-600",
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

/* ── Stepper (passenger count) — §12.4 ── */
export function Stepper({
  value,
  onChange,
  min = 1,
  max = 19,
  ariaLabel,
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  ariaLabel: string;
}) {
  const btn =
    "grid h-11 w-11 place-items-center rounded-control border border-line-300 text-ink-700 " +
    "transition-colors duration-120 hover:bg-haze-050 hover:border-ink-400 disabled:text-ink-200 " +
    "disabled:cursor-not-allowed disabled:hover:bg-paper disabled:hover:border-line-300";
  return (
    <div className="inline-flex items-center gap-4" role="group" aria-label={ariaLabel}>
      <button type="button" className={btn} onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label="Decrease">
        <Minus size={20} strokeWidth={1.5} />
      </button>
      <span className="min-w-10 text-center type-data-lg text-ink-700" aria-live="polite">{value}</span>
      <button type="button" className={btn} onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label="Increase">
        <Plus size={20} strokeWidth={1.5} />
      </button>
    </div>
  );
}

/* ── Filter / selection chip — §11.11 ── */
export function Chip({
  selected,
  onClick,
  children,
}: {
  selected?: boolean;
  onClick?: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        "inline-flex h-9 items-center gap-1.5 rounded-pill border px-4 type-body-sm transition-colors duration-120",
        selected
          ? "border-cyan-600 bg-cyan-050 text-cyan-600"
          : "border-line-300 bg-paper text-ink-600 hover:border-ink-400",
      )}
    >
      {selected && <Check size={16} strokeWidth={1.5} />}
      {children}
    </button>
  );
}

/* ── Switch — §12.4 pets ── */
export function Switch({
  checked,
  onChange,
  ariaLabel,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-6 w-11 shrink-0 rounded-pill transition-colors duration-120",
        checked ? "bg-cyan-600" : "bg-haze-200",
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 left-0.5 h-5 w-5 rounded-pill bg-paper transition-transform duration-120",
          checked && "translate-x-5",
        )}
      />
    </button>
  );
}

/* ── Radio row — contact method, payment method ── */
export function RadioCard({
  selected,
  onSelect,
  title,
  description,
  trailing,
}: {
  selected: boolean;
  onSelect: () => void;
  title: ReactNode;
  description?: ReactNode;
  trailing?: ReactNode;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={cn(
        "flex w-full items-center gap-3 rounded-card border bg-paper p-4 text-left transition-colors duration-120",
        selected ? "border-cyan-600 bg-cyan-050" : "border-line-200 hover:border-line-300",
      )}
    >
      <span
        className={cn(
          "mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-pill border-2",
          selected ? "border-cyan-600" : "border-line-300",
        )}
      >
        {selected && <span className="h-2.5 w-2.5 rounded-pill bg-cyan-600" />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block type-h3 text-ink-700">{title}</span>
        {description && <span className="mt-0.5 block type-body-sm text-ink-400">{description}</span>}
      </span>
      {trailing && <span className="shrink-0">{trailing}</span>}
    </button>
  );
}
