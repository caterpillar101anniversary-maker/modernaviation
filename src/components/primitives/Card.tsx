import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

/**
 * The one card style (§11.4). Paper, 1px line-200, radius-card, and — this is
 * the load-bearing rule — no resting shadow. A resting card with a shadow is
 * the single fastest way to make a premium site look like a template.
 *
 * Pass `interactive` only when the whole card is a link: it earns the 2px lift,
 * the border darken, and shadow-raised on hover.
 */
export function Card({
  interactive = false,
  className,
  ...props
}: ComponentPropsWithoutRef<"div"> & { interactive?: boolean }) {
  return (
    <div
      className={cn(
        "bg-paper border border-line-200 rounded-card p-5 md:p-6",
        interactive &&
          "transition-[border-color,box-shadow,transform] duration-200 ease-out " +
            "hover:border-line-300 hover:shadow-raised hover:-translate-y-0.5",
        className,
      )}
      {...props}
    />
  );
}
