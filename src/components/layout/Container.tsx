import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

/**
 * Content max-width 1280px, centred, with the §5.2 responsive gutters:
 * 40px ≥1024, 24px 640–1023, 20px <640.
 */
export function Container({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn("mx-auto w-full max-w-320 px-5 sm:px-6 lg:px-10", className)}
      {...props}
    />
  );
}
