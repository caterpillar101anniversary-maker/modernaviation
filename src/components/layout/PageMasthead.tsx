import type { ReactNode } from "react";
import { Container } from "@/components/layout/Container";
import { CourseLineStub } from "@/components/aviation/CourseLine";

/**
 * Page masthead — required on every interior page (§11.2). Sits on haze-100,
 * top padding space-10, bottom space-9. Contains the page's single <h1>.
 * (The homepage is the one exception: its dark hero serves this role.)
 */
export function PageMasthead({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="bg-haze-100 pt-16 pb-12">
      <Container>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-160">
            <CourseLineStub />
            <p className="mt-3 type-label text-ink-400">{eyebrow}</p>
            <h1 className="mt-2 type-display-2 text-ink-700">{title}</h1>
            {description && (
              <p className="mt-4 type-body-lg max-w-140 text-ink-400">{description}</p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      </Container>
    </div>
  );
}
