import { Plane } from "lucide-react";
import { cn } from "@/lib/cn";
import { formatDuration } from "@/lib/format";
import type { RoutePoint } from "@/components/aviation/RouteDisplay";

/**
 * A stylised chart of the flight path (§8.3): a light basemap, the route drawn
 * as a magenta Course Line, airports as ink-700 dots with mono labels, in a
 * radius-window container. Not a live tile map — a real basemap replaces this
 * before launch. It reads as an instrument panel, not decoration.
 */
export function FlightPathMap({
  from,
  to,
  durationMinutes,
  dark = false,
  className,
}: {
  from: RoutePoint;
  to: RoutePoint;
  durationMinutes: number;
  dark?: boolean;
  className?: string;
}) {
  const origin = { x: 150, y: 275 };
  const dest = { x: 650, y: 110 };
  const control = { x: 400, y: 40 };
  const mid = { x: 400, y: 120 };
  const path = `M${origin.x} ${origin.y} Q${control.x} ${control.y} ${dest.x} ${dest.y}`;

  const line = dark ? "var(--color-course-400)" : "var(--color-course-500)";
  const grid = dark ? "var(--color-ink-800)" : "var(--color-line-200)";
  const dot = dark ? "var(--color-paper)" : "var(--color-ink-700)";
  const labelPrimary = dark ? "text-paper" : "text-ink-700";
  const labelSub = dark ? "text-ink-ondark" : "text-ink-400";

  return (
    <figure
      className={cn(
        "relative overflow-hidden rounded-window border",
        dark ? "border-ink-800 bg-ink-900" : "border-line-200 bg-haze-050",
        className,
      )}
    >
      <svg viewBox="0 0 800 360" className="w-full" fill="none" role="img"
        aria-label={`Flight path from ${from.name} (${from.iata}) to ${to.name} (${to.iata})`}>
        {/* Graticule — a sparse chart grid. */}
        {[160, 320, 480, 640].map((x) => (
          <line key={`v${x}`} x1={x} y1="0" x2={x} y2="360" stroke={grid} strokeWidth="1" />
        ))}
        {[90, 180, 270].map((y) => (
          <line key={`h${y}`} x1="0" y1={y} x2="800" y2={y} stroke={grid} strokeWidth="1" />
        ))}

        {/* The committed path. */}
        <path d={path} stroke={line} strokeWidth="1.5" strokeLinecap="round" />
        <circle cx={origin.x} cy={origin.y} r="6" fill={dot} />
        <circle cx={dest.x} cy={dest.y} r="6" fill={dot} />
      </svg>

      {/* Plane glyph riding the midpoint of the arc. */}
      <span
        className="absolute grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-pill"
        style={{
          left: `${(mid.x / 800) * 100}%`,
          top: `${(mid.y / 360) * 100}%`,
          width: 26,
          height: 26,
          background: dark ? "var(--color-ink-900)" : "var(--color-haze-050)",
        }}
      >
        <Plane size={16} strokeWidth={1.5} className="rotate-45" style={{ color: line }} aria-hidden />
      </span>

      {/* Endpoint labels. */}
      <figcaption
        className="absolute"
        style={{ left: `${(origin.x / 800) * 100}%`, top: `${(origin.y / 360) * 100}%`, transform: "translate(-50%, 14px)" }}
      >
        <div className={cn("text-center type-data-sm", labelPrimary)}>{from.iata}</div>
        <div className={cn("text-center type-data-sm", labelSub)}>{from.icao}</div>
      </figcaption>
      <figcaption
        className="absolute"
        style={{ left: `${(dest.x / 800) * 100}%`, top: `${(dest.y / 360) * 100}%`, transform: "translate(-50%, -34px)" }}
      >
        <div className={cn("text-center type-data-sm", labelPrimary)}>{to.iata}</div>
        <div className={cn("text-center type-data-sm", labelSub)}>{to.icao}</div>
      </figcaption>

      {/* Duration chip. */}
      <span
        className={cn(
          "absolute bottom-3 right-3 rounded-pill border px-2.5 py-1 type-data-sm",
          dark ? "border-ink-800 bg-ink-000 text-ink-ondark" : "border-line-200 bg-paper text-ink-400",
        )}
      >
        {formatDuration(durationMinutes)} · nonstop
      </span>
    </figure>
  );
}
