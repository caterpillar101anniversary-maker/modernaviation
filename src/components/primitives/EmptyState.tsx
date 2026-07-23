import type { ComponentType, ReactNode } from "react";

/**
 * Empty state — §14.2. A 32px line icon, an h3 statement of what's absent, one
 * body-sm line, and exactly one primary action. Centred in a paper panel.
 * Never an illustration, never a mascot.
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center rounded-card border border-line-200 bg-paper px-6 py-12 text-center">
      <Icon size={32} strokeWidth={1.5} className="text-ink-200" />
      <h3 className="mt-4 type-h3 text-ink-700">{title}</h3>
      <p className="mt-1 max-w-100 type-body-sm text-ink-400">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
