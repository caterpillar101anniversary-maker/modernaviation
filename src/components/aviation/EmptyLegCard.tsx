import Link from "next/link";
import { CalendarClock, Users } from "lucide-react";
import { Card } from "@/components/primitives/Card";
import { Badge } from "@/components/primitives/Badge";
import { AircraftMedia } from "@/components/aviation/AircraftMedia";
import { RouteDisplay } from "@/components/aviation/RouteDisplay";
import type { EmptyLeg } from "@/lib/data";
import { formatUsd } from "@/lib/format";

/**
 * Variant B — Empty leg card (§11.4). 16:9 media, body leads with a Route
 * Display, then the departure window, the discount as an ok-050 pill, and the
 * seat count.
 */
export function EmptyLegCard({ leg }: { leg: EmptyLeg }) {
  return (
    <Card interactive className="flex flex-col gap-4 p-4 md:p-4">
      <Link href={`/empty-legs/${leg.id}`} className="flex flex-col gap-4 rounded-card">
        <AircraftMedia
          registration={leg.registration}
          category={leg.category}
          ratio="16/9"
        />

        <RouteDisplay from={leg.from} to={leg.to} durationMinutes={leg.durationMinutes} />

        <div className="border-t border-line-200 pt-4">
          <div className="flex items-center gap-2 text-ink-600">
            <CalendarClock size={16} strokeWidth={1.5} className="text-ink-400" aria-hidden />
            <span className="type-data">{leg.windowLabel}</span>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge tone="ok">{leg.discountPct}% below charter</Badge>
            <span className="inline-flex items-center gap-1.5 type-data-sm text-ink-400">
              <Users size={14} strokeWidth={1.5} aria-hidden />
              {leg.seats} seats
            </span>
          </div>
          <p className="mt-3 type-data-lg text-ink-700">
            from {formatUsd(leg.fromUsd)}
            <span className="ml-1 type-body-sm text-ink-400">· {leg.aircraft}</span>
          </p>
        </div>
      </Link>
    </Card>
  );
}
