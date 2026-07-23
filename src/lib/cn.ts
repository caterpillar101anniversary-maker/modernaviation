import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind classes with conflict resolution. Every primitive accepts a
 * `className` and merges it through here (design.md §10).
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
