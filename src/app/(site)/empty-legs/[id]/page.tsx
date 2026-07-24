import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, TriangleAlert, Users, CalendarClock } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Badge } from "@/components/primitives/Badge";
import { Button } from "@/components/primitives/Button";
import { CourseLineStub } from "@/components/aviation/CourseLine";
import { RouteDisplay } from "@/components/aviation/RouteDisplay";
import { FlightPathMap } from "@/components/aviation/FlightPathMap";
import { AircraftMedia } from "@/components/aviation/AircraftMedia";
import { emptyLegs, findEmptyLeg, findAircraft } from "@/lib/data";
import { formatUsd } from "@/lib/format";

export function generateStaticParams() {
  return emptyLegs.map((l) => ({ id: l.id }));
}

export default async function EmptyLegDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const leg = findEmptyLeg(id);
  if (!leg) notFound();
  const aircraft = findAircraft(leg.aircraftSlug);
  const saving = leg.charterUsd - leg.fromUsd;

  return (
    <>
      <div className="bg-haze-100 pt-12 pb-9">
        <Container>
          <CourseLineStub />
          <p className="mt-3 type-label text-ink-400">Empty leg · {leg.category}</p>
          <h1 className="mt-2 type-display-2 text-ink-700">{leg.from.iata} → {leg.to.iata}</h1>
        </Container>
      </div>

      <Container className="py-12">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div className="flex flex-col gap-10">
            <div className="max-w-160">
              <RouteDisplay
                from={{ ...leg.from, time: leg.windowLabel.split("·")[1]?.trim().split("–")[0], tz: "EDT" }}
                to={leg.to}
                durationMinutes={leg.durationMinutes}
              />
            </div>

            <FlightPathMap from={leg.from} to={leg.to} durationMinutes={leg.durationMinutes} />

            <section>
              <h2 className="type-h2 text-ink-700">Departure window</h2>
              <div className="mt-3 flex items-center gap-2 text-ink-600">
                <CalendarClock size={20} strokeWidth={1.5} className="text-ink-400" />
                <span className="type-data">{leg.windowLabel}</span>
              </div>
              <p className="mt-3 max-w-160 type-body text-ink-600">{leg.windowDetail}</p>
            </section>

            <section>
              <h2 className="type-h2 text-ink-700">Aircraft</h2>
              <div className="mt-6">
                <AircraftMedia registration={leg.registration} category={leg.category} ratio="16/9" />
              </div>
              {aircraft && (
                <p className="mt-4 type-body text-ink-600">
                  {aircraft.model} · {aircraft.seats} seats · {aircraft.baggageM3} m³ baggage · operated by {aircraft.operator}.
                </p>
              )}
            </section>

            {/* Empty-leg risk — never softened (§13.5) */}
            <div className="flex items-start gap-3 rounded-card border border-warn-600/30 bg-warn-050 p-5">
              <TriangleAlert size={20} strokeWidth={1.5} className="mt-0.5 shrink-0 text-warn-600" />
              <p className="type-body-sm text-ink-700">
                Empty legs depend on the originating charter. If that charter changes its schedule or
                cancels, this leg can be cancelled or re-timed, sometimes at short notice. We&apos;ll
                refund you in full if that happens, but we can&apos;t guarantee the slot until the
                operator confirms.
              </p>
            </div>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-card border border-line-200 bg-paper p-6">
              <Badge tone="ok">{leg.discountPct}% below charter</Badge>
              <p className="mt-4 type-label text-ink-400">Empty-leg price from</p>
              <p className="mt-1 type-data-xl text-ink-700">{formatUsd(leg.fromUsd)}</p>
              <p className="type-data-sm text-ink-400">USD</p>
              <div className="mt-4 flex flex-col gap-1 border-t border-line-200 pt-4">
                <div className="flex justify-between type-body-sm">
                  <span className="text-ink-400">Full charter</span>
                  <span className="text-ink-600 line-through">{formatUsd(leg.charterUsd)}</span>
                </div>
                <div className="flex justify-between type-body-sm">
                  <span className="text-ink-400">You save</span>
                  <span className="text-ok-600">{formatUsd(saving)}</span>
                </div>
                <div className="mt-1 flex items-center gap-1.5 type-body-sm text-ink-400">
                  <Users size={14} strokeWidth={1.5} /> up to {leg.seats} seats
                </div>
              </div>
              <Button asChild className="mt-5 w-full">
                <Link href="/request">Request this leg<ArrowRight size={20} strokeWidth={1.5} /></Link>
              </Button>
            </div>
          </aside>
        </div>
      </Container>
    </>
  );
}
