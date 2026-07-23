import { cn } from "@/lib/cn";

/**
 * Spec table — §11.10. Header row haze-050 (label token), body rows 48px with
 * a line-200 bottom border, last row borderless. Zebra striping is forbidden —
 * the row borders do the work. On mobile it becomes a definition list.
 */
export interface SpecRow {
  label: string;
  value: string;
  /** Right-align and typeset in the mono face when the value is numeric. */
  numeric?: boolean;
}

export function SpecTable({
  header,
  rows,
  className,
}: {
  header?: { label: string; value: string };
  rows: SpecRow[];
  className?: string;
}) {
  return (
    <div className={cn("overflow-hidden rounded-card border border-line-200 bg-paper", className)}>
      {header && (
        <div className="flex h-11 items-center justify-between gap-4 bg-haze-050 px-4">
          <span className="type-label text-ink-400">{header.label}</span>
          <span className="type-label text-ink-400">{header.value}</span>
        </div>
      )}
      <dl>
        {rows.map((row, i) => (
          <div
            key={row.label}
            className={cn(
              "flex min-h-12 items-center justify-between gap-4 px-4 py-2.5",
              i < rows.length - 1 && "border-b border-line-200",
            )}
          >
            <dt className="type-body-sm text-ink-400">{row.label}</dt>
            <dd
              className={cn(
                "text-right text-ink-700",
                row.numeric ? "type-data" : "type-body",
              )}
            >
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
