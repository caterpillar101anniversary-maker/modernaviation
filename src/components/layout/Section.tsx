import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { CourseLineStub } from "@/components/aviation/CourseLine";

/**
 * The section rhythm from §5.4 — identical on every section of every page.
 * This block is the primary mechanism by which nothing looks out of place:
 *
 *   [--space-section top pad]
 *   [Course Line stub 48px]        ← CL-5
 *   [eyebrow] [h1] [lead]
 *   [--space-9] [content]
 *   [--space-section bottom pad]
 */
export function Section({
  eyebrow,
  title,
  lead,
  children,
  dark = false,
  containerClassName,
  className,
  id,
}: {
  eyebrow?: string;
  title?: ReactNode;
  lead?: ReactNode;
  children?: ReactNode;
  /** Dark surfaces only in the four places named in P1. */
  dark?: boolean;
  containerClassName?: string;
  className?: string;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "py-18 md:py-28", // 72px mobile / 112px desktop — --space-section
        dark ? "bg-ink-000" : "",
        className,
      )}
    >
      <div className={cn("mx-auto w-full max-w-320 px-5 sm:px-6 lg:px-10", containerClassName)}>
        {(eyebrow || title) && (
          <header className="mb-9 max-w-160">
            <CourseLineStub dark={dark} />
            {eyebrow && (
              <p className={cn("mt-3 type-label", dark ? "text-ink-ondark" : "text-ink-400")}>
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className={cn("mt-2 type-h1", dark ? "text-paper" : "text-ink-700")}>
                {title}
              </h2>
            )}
            {lead && (
              <p
                className={cn(
                  "mt-4 type-body-lg max-w-140",
                  dark ? "text-ink-ondark" : "text-ink-400",
                )}
              >
                {lead}
              </p>
            )}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}
