import { notFound, redirect } from "next/navigation";
import { Download, FileText, Phone, MapPin } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Badge } from "@/components/primitives/Badge";
import { Button } from "@/components/primitives/Button";
import { RouteDisplay } from "@/components/aviation/RouteDisplay";
import { FlightPathMap } from "@/components/aviation/FlightPathMap";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/session";
import { bookingToTrip } from "@/lib/mappers";
import { brand } from "@/config/brand";

export default async function TripDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getSessionUser();
  if (!user) redirect("/signin");

  const booking = await prisma.booking.findFirst({ where: { id, userId: user.id } });
  if (!booking) notFound();
  const trip = bookingToTrip(booking);

  const statusTone = trip.status === "cancelled" ? "stop" : trip.nextAction ? "pending" : "ok";
  const statusText = trip.status === "cancelled" ? "Cancelled" : trip.nextAction ? "Action needed" : "Confirmed";

  const timeline = [
    { time: "45 min prior", label: "Arrive at FBO", place: trip.fboFrom },
    { time: `${trip.from.time} ${trip.from.tz}`, label: "Departure", place: `${trip.from.name} (${trip.from.iata})` },
    { time: `${trip.to.time} ${trip.to.tz}`, label: "Arrival", place: `${trip.to.name} (${trip.to.iata})` },
    { time: "On arrival", label: "Ground transport", place: trip.fboTo },
  ];

  return (
    <>
      {/* Dark itinerary header (§13.6) */}
      <section className="bg-ink-000">
        <Container className="py-12">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="type-label text-ink-ondark">Itinerary · {trip.dateLabel}</p>
              <p className="mt-1 type-data-lg text-paper">{trip.code}</p>
            </div>
            <Badge tone={statusTone}>{statusText}</Badge>
          </div>
          <div className="mt-8 max-w-160">
            <RouteDisplay from={trip.from} to={trip.to} durationMinutes={trip.durationMinutes} dark />
          </div>
        </Container>
      </section>

      <Container className="py-12">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr]">
          <div className="flex flex-col gap-12">
            {/* Timeline with a Course Line spine */}
            <section>
              <h2 className="type-h2 text-ink-700">Day of travel</h2>
              <ol className="relative mt-6 flex flex-col gap-8 pl-8">
                <span aria-hidden className="absolute left-[7px] top-2 bottom-2 w-px bg-course-500" />
                {timeline.map((item) => (
                  <li key={item.label} className="relative">
                    <span aria-hidden className="absolute -left-8 top-1 grid h-4 w-4 place-items-center rounded-pill bg-paper">
                      <span className="h-3 w-3 rounded-pill border-2 border-course-500 bg-paper" />
                    </span>
                    <p className="type-data-sm text-ink-400">{item.time}</p>
                    <p className="type-h3 text-ink-700">{item.label}</p>
                    <p className="type-body-sm text-ink-400">{item.place}</p>
                  </li>
                ))}
              </ol>
            </section>

            {/* Aircraft & crew */}
            <section>
              <h2 className="type-h2 text-ink-700">Aircraft &amp; crew</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-card border border-line-200 bg-paper p-5">
                  <p className="type-label text-ink-400">Aircraft</p>
                  <p className="mt-1 type-body text-ink-700">{trip.aircraftModel}</p>
                  <p className="type-data-sm text-ink-400">{trip.registration} · {trip.operator}</p>
                </div>
                <div className="rounded-card border border-line-200 bg-paper p-5">
                  <p className="type-label text-ink-400">Crew</p>
                  <p className="mt-1 type-body text-ink-700">Capt. R. Hayes · FO S. Powell</p>
                  <p className="type-data-sm text-ink-400">Cabin: 1</p>
                </div>
              </div>
            </section>

            {/* FBO + map */}
            <section>
              <h2 className="type-h2 text-ink-700">Departure FBO</h2>
              <div className="mt-6 flex items-start gap-2 text-ink-600">
                <MapPin size={20} strokeWidth={1.5} className="mt-0.5 shrink-0 text-ink-400" />
                <p className="type-body">{trip.fboFrom}</p>
              </div>
              <div className="mt-4">
                <FlightPathMap from={trip.from} to={trip.to} durationMinutes={trip.durationMinutes} />
              </div>
            </section>

            {/* Passengers */}
            <section>
              <h2 className="type-h2 text-ink-700">Passengers</h2>
              <div className="mt-6 overflow-hidden rounded-card border border-line-200">
                {trip.passengers.map((p, i) => (
                  <div key={p.name} className={"flex items-center justify-between gap-4 bg-paper px-4 py-3 " + (i < trip.passengers.length - 1 ? "border-b border-line-200" : "")}>
                    <div>
                      <p className="type-body text-ink-700">{p.name}</p>
                      <p className="type-body-sm text-ink-400">{p.role} · {p.nationality}</p>
                    </div>
                    <span className="type-data-sm text-ink-400">{p.weightKg} kg</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right rail: documents + dispatch */}
          <aside className="lg:sticky lg:top-24 lg:self-start print:hidden">
            <div className="flex flex-col gap-4">
              <div className="rounded-card border border-line-200 bg-paper p-6">
                <h3 className="type-h3 text-ink-700">Documents</h3>
                <ul className="mt-4 flex flex-col gap-1">
                  {["Charter agreement", "Payment receipt", "Trip sheet"].map((doc) => (
                    <li key={doc}>
                      <a href="#" className="flex items-center justify-between rounded-control px-2 py-2.5 transition-colors duration-120 hover:bg-haze-050">
                        <span className="flex items-center gap-2 type-body-sm text-ink-700">
                          <FileText size={16} strokeWidth={1.5} className="text-ink-400" /> {doc}
                        </span>
                        <Download size={16} strokeWidth={1.5} className="text-cyan-600" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-card border border-line-200 bg-paper p-6">
                <h3 className="type-h3 text-ink-700">Contact dispatch</h3>
                <p className="mt-1 type-body-sm text-ink-400">Someone answers around the clock.</p>
                <Button asChild variant="secondary" className="mt-4 w-full">
                  <a href={brand.phoneHref}><Phone size={20} strokeWidth={1.5} />{brand.phoneDisplay}</a>
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </>
  );
}
