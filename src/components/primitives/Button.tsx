"use client";

import { Slot } from "@radix-ui/react-slot";
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "destructive" | "onDark";
type Size = "sm" | "md" | "lg";

// One shape. Every button in the product is one of these variants (§11.1).
const base =
  "type-body inline-flex items-center justify-center gap-2 rounded-control " +
  "font-semibold whitespace-nowrap select-none " +
  "transition-[background-color,border-color,transform] duration-120 ease-out " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600 " +
  "disabled:cursor-not-allowed";

// Heights and horizontal padding only — text size is constant at body 15/24.
const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5",
  md: "h-11 px-5",
  lg: "h-13 px-7",
};

const variants: Record<Variant, string> = {
  primary:
    "bg-ink-700 text-paper hover:bg-ink-600 active:translate-y-px " +
    "disabled:bg-haze-200 disabled:text-ink-200 disabled:hover:bg-haze-200",
  secondary:
    "bg-paper text-ink-700 border border-line-300 hover:bg-haze-050 hover:border-ink-400 active:bg-haze-200 " +
    "disabled:bg-haze-050 disabled:text-ink-200 disabled:border-line-200",
  ghost:
    "bg-transparent text-cyan-600 hover:bg-cyan-050 active:bg-cyan-050 active:text-cyan-500 " +
    "disabled:text-ink-200 disabled:hover:bg-transparent",
  destructive:
    "bg-paper text-stop-600 border border-stop-600 hover:bg-stop-050 active:bg-stop-050 " +
    "disabled:bg-haze-050 disabled:text-ink-200 disabled:border-line-200",
  onDark:
    "bg-paper text-ink-000 hover:bg-paper-hover active:translate-y-px " +
    "disabled:bg-ink-800 disabled:text-ink-400",
};

export interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
  variant?: Variant;
  size?: Size;
  /** Render as a child element (e.g. a Next.js <Link>) while keeping button styling. */
  asChild?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  asChild = false,
  className,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(base, sizes[size], variants[variant], className)}
      {...props}
    />
  );
}
