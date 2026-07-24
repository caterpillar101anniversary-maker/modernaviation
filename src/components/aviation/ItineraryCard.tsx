import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/primitives/Badge";
import { RouteDisplay } from "@/components/aviation/RouteDisplay";
import type { Trip } from "@/lib/data";

/**
 * Variant D — Itinerary card (§11.4). No image. A 4px left rail runs the full
 * height: course-500 for confirmed, warn-600 for pending. Content is the Route
 * Display, date/time, aircraft + tail, FBOs, and passenger count; status badge
 * sits top-right.
 */
export function ItineraryCard({ trip }: { trip: Trip }) {
  const railColor =
    trip.status === "cancelled"
      ? "var(--color-stop-600)"
      : trip.nextAction
        ? "var(--color-warn-600)"
        : "var(--color-course-500)";

  const statusTone = trip.status === "cancelled" ? "stop" : trip.nextAction ? "pending" : "ok";
  const statusText =
    trip.status === "cancelled" ? "Cancelled" : trip.nextAction ? "Action needed" : "Confirmed";

  return (
    <div className="relative overflow-hidden rounded-card border border-line-200 bg-paper">
      <span className="absolute inset-y-0 left-0 w-1" style={{ background: railColor }} aria-hidden />
      <div className="flex flex-col gap-4 p-5 pl-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="type-data-sm text-ink-400">{trip.code}</p>
            <p className="type-body-sm text-ink-400">{trip.dateLabel}</p>
          </div>
          <Badge tone={statusTone}>{statusText}</Badge>
        </div>

        <RouteDisplay from={trip.from} to={trip.to} durationMinutes={trip.durationMinutes} />

        <div className="grid grid-cols-2 gap-x-4 gap-y-2 border-t border-line-200 pt-4">
          <div>
            <p className="type-label text-ink-400">Aircraft</p>
            <p className="type-data-sm text-ink-700">{trip.aircraftModel} · {trip.registration}</p>
          </div>
          <div>
            <p className="type-label text-ink-400">Passengers</p>
            <p className="type-data-sm text-ink-700">{trip.passengers.length}</p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-line-200 pt-4">
          <Link href={`/trips/${trip.id}`} className="rounded-control type-body-sm font-semibold text-cyan-600 hover:text-cyan-500">
            View itinerary
          </Link>
          {trip.nextAction && (
            <Link href={trip.nextAction.href} className="inline-flex items-center gap-1 rounded-control type-body-sm font-semibold text-cyan-600 hover:text-cyan-500">
              {trip.nextAction.label}
              <ArrowRight size={16} strokeWidth={1.5} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
