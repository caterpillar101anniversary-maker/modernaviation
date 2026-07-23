import { Plane } from "lucide-react";
import { cn } from "@/lib/cn";
import { formatDuration } from "@/lib/format";

/**
 * Route Display — the CL-3 component (§11.5). The most-used component in the
 * product: empty-leg cards, quote cards, itineraries, wizard summary, emails.
 *
 * The connector is a Course Line with a 16px aircraft glyph at the midpoint,
 * rotated to point along the line, sitting on a paper disc so the line reads
 * as passing behind it.
 */

export interface RoutePoint {
  iata: string;
  icao: string;
  name: string;
  time?: string;
  tz?: string;
}

function PlaneGlyph({ dark }: { dark: boolean }) {
  const stroke = dark ? "var(--color-course-400)" : "var(--color-course-500)";
  const disc = dark ? "var(--color-ink-000)" : "var(--color-paper)";
  return (
    <span
      className="relative z-10 grid place-items-center rounded-pill"
      style={{ width: 20, height: 20, background: disc }}
    >
      {/* Lucide's plane points up-right; rotate 45° so the nose runs along
          the horizontal Course Line, on a disc so the line reads behind it. */}
      <Plane
        size={16}
        strokeWidth={1.5}
        className="rotate-45"
        style={{ color: stroke }}
        aria-hidden
      />
    </span>
  );
}

export function RouteDisplay({
  from,
  to,
  durationMinutes,
  stops = "nonstop",
  dark = false,
  className,
}: {
  from: RoutePoint;
  to: RoutePoint;
  durationMinutes: number;
  stops?: string;
  dark?: boolean;
  className?: string;
}) {
  const codeColor = dark ? "text-paper" : "text-ink-700";
  const subColor = dark ? "text-ink-ondark" : "text-ink-400";
  const lineColor = dark ? "var(--color-course-400)" : "var(--color-course-500)";

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-start gap-3">
        {/* Origin */}
        <div className="shrink-0 text-left">
          <div className={cn("type-data-lg", codeColor)}>{from.iata}</div>
          <div className={cn("type-data-sm", subColor)}>{from.icao}</div>
        </div>

        {/* Connector: Course Line behind a plane glyph at the midpoint. */}
        <div className="relative flex min-w-0 flex-1 items-center pt-1.5">
          <span
            className="absolute inset-x-0 top-1/2 block h-px -translate-y-1/2"
            style={{ background: lineColor }}
            aria-hidden
          />
          <span className="mx-auto">
            <PlaneGlyph dark={dark} />
          </span>
        </div>

        {/* Destination */}
        <div className="shrink-0 text-right">
          <div className={cn("type-data-lg", codeColor)}>{to.iata}</div>
          <div className={cn("type-data-sm", subColor)}>{to.icao}</div>
        </div>
      </div>

      {/* Airport names + times row */}
      <div className="mt-1.5 flex items-start justify-between gap-4">
        <div className="min-w-0 text-left">
          <p className={cn("type-body-sm truncate", subColor)}>{from.name}</p>
          {from.time && (
            <p className={cn("type-data", codeColor)}>
              {from.time} {from.tz}
            </p>
          )}
        </div>
        <div className="min-w-0 text-right">
          <p className={cn("type-body-sm truncate", subColor)}>{to.name}</p>
          {to.time && (
            <p className={cn("type-data", codeColor)}>
              {to.time} {to.tz}
            </p>
          )}
        </div>
      </div>

      {/* Duration centred below the line */}
      <p className={cn("mt-2 text-center type-data-sm", subColor)}>
        {formatDuration(durationMinutes)} · {stops}
      </p>
    </div>
  );
}
