import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Wifi, DoorClosed, MoveVertical, BedDouble, Check } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Badge } from "@/components/primitives/Badge";
import { Button } from "@/components/primitives/Button";
import { SpecTable } from "@/components/primitives/SpecTable";
import { AircraftMedia } from "@/components/aviation/AircraftMedia";
import { AircraftCard } from "@/components/aviation/AircraftCard";
import { CourseLineStub } from "@/components/aviation/CourseLine";
import { fleet, findAircraft } from "@/lib/data";
import { formatUsd } from "@/lib/format";

export function generateStaticParams() {
  return fleet.map((a) => ({ slug: a.slug }));
}

const amenityMeta = [
  { key: "lavatory", label: "Enclosed lavatory", icon: DoorClosed },
  { key: "wifi", label: "Wi-Fi", icon: Wifi },
  { key: "standing", label: "Standing cabin", icon: MoveVertical },
  { key: "flatBed", label: "Flat bed", icon: BedDouble },
] as const;

function CabinDiagram({ seats }: { seats: number }) {
  const rows = Math.ceil(seats / 2);
  return (
    <svg viewBox="0 0 320 140" className="w-full max-w-100" fill="none" role="img" aria-label="Cabin layout, top view">
      {/* Fuselage outline */}
      <path
        d="M20 70 Q20 20 90 20 L250 20 Q300 20 305 70 Q300 120 250 120 L90 120 Q20 120 20 70 Z"
        stroke="var(--color-ink-700)"
        strokeWidth="1.5"
      />
      {/* Seats */}
      {Array.from({ length: rows }).map((_, r) =>
        [0, 1].map((c) => {
          const idx = r * 2 + c;
          if (idx >= seats) return null;
          const x = 80 + r * 40;
          const y = c === 0 ? 48 : 78;
          return <rect key={idx} x={x} y={y} width="26" height="20" rx="4" stroke="var(--color-course-500)" strokeWidth="1.5" />;
        }),
      )}
      {/* Aisle centreline */}
      <line x1="70" y1="70" x2="290" y2="70" stroke="var(--color-ink-200)" strokeWidth="1" strokeDasharray="4 4" />
    </svg>
  );
}

export default async function AircraftDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = findAircraft(slug);
  if (!a) notFound();

  const similar = fleet.filter((x) => x.slug !== a.slug && x.categorySlug === a.categorySlug).slice(0, 3);
  const filler = fleet.filter((x) => x.slug !== a.slug && x.categorySlug !== a.categorySlug);
  const similarShown = [...similar, ...filler].slice(0, 3);

  return (
    <>
      <div className="bg-haze-100 pt-12 pb-9">
        <Container>
          <CourseLineStub />
          <p className="mt-3 type-label text-ink-400">{a.category} · {a.operator}</p>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="type-display-2 text-ink-700">{a.model}</h1>
              <p className="mt-1 type-data-lg text-ink-400">{a.registration}</p>
            </div>
            <Button asChild>
              <Link href="/request">Request this aircraft<ArrowRight size={20} strokeWidth={1.5} /></Link>
            </Button>
          </div>
        </Container>
      </div>

      <Container className="py-12">
        {/* Gallery */}
        <div className="grid gap-4 md:grid-cols-3">
          <AircraftMedia registration={a.registration} category={a.category} ratio="16/9" className="md:col-span-3" />
          <AircraftMedia registration={a.registration} category="Cabin" ratio="4/3" />
          <AircraftMedia registration={a.registration} category="Galley" ratio="4/3" />
          <AircraftMedia registration={a.registration} category="Baggage" ratio="4/3" />
        </div>

        <div className="mt-12 grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          {/* Left: specs */}
          <div className="flex flex-col gap-10">
            <section>
              <h2 className="type-h2 text-ink-700">Specifications</h2>
              <div className="mt-6">
                <SpecTable
                  header={{ label: "Performance & cabin", value: "" }}
                  rows={[
                    { label: "Passengers", value: String(a.seats), numeric: true },
                    { label: "Range", value: `${a.rangeKm.toLocaleString()} km`, numeric: true },
                    { label: "Cruise speed", value: `${a.speedKmh} km/h`, numeric: true },
                    { label: "Baggage", value: `${a.baggageM3} m³`, numeric: true },
                    { label: "Cabin height", value: `${a.cabinHeightM} m`, numeric: true },
                    { label: "Cabin width", value: `${a.cabinWidthM} m`, numeric: true },
                    { label: "Runway required", value: `${a.runwayM.toLocaleString()} m`, numeric: true },
                    { label: "Year", value: String(a.year), numeric: true },
                    ...(a.refurbished ? [{ label: "Refurbished", value: String(a.refurbished), numeric: true }] : []),
                  ]}
                />
              </div>
            </section>

            <section>
              <h2 className="type-h2 text-ink-700">Amenities</h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {amenityMeta.map(({ key, label, icon: Icon }) => {
                  const has = a.amenities[key];
                  return (
                    <div key={key} className={"flex items-center gap-3 rounded-card border border-line-200 bg-paper px-4 py-3 " + (has ? "" : "opacity-50")}>
                      <Icon size={20} strokeWidth={1.5} className="text-ink-400" />
                      <span className="type-body text-ink-700">{label}</span>
                      {has && <Check size={16} strokeWidth={1.5} className="ml-auto text-ok-600" />}
                    </div>
                  );
                })}
              </div>
            </section>

            <section>
              <h2 className="type-h2 text-ink-700">Cabin layout</h2>
              <div className="mt-6 rounded-card border border-line-200 bg-paper p-6">
                <CabinDiagram seats={a.seats} />
              </div>
            </section>

            <section>
              <h2 className="type-h2 text-ink-700">Operator</h2>
              <div className="mt-6 flex flex-wrap items-center gap-3 rounded-card border border-line-200 bg-paper p-5">
                <div className="flex-1">
                  <p className="type-h3 text-ink-700">{a.operator}</p>
                  <p className="mt-1 type-body-sm text-ink-400">Holds a current air operator certificate. Audited under {a.safety}.</p>
                </div>
                <Badge tone="safety">{a.safety}</Badge>
                <Badge tone="ok">{a.part}</Badge>
              </div>
            </section>
          </div>

          {/* Right: sticky request panel */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-card border border-line-200 bg-paper p-6">
              <p className="type-label text-ink-400">Indicative rate</p>
              <p className="mt-2 type-data-lg text-ink-700">from {formatUsd(a.hourlyUsd)}</p>
              <p className="type-body-sm text-ink-400">per block hour · final price on quote</p>
              <div className="mt-5 flex flex-col gap-3 border-t border-line-200 pt-5">
                <Link href="/request" className="flex items-center justify-between rounded-control border border-line-300 px-4 py-3 transition-colors duration-120 hover:bg-haze-050">
                  <span className="type-label text-ink-400">Route</span>
                  <span className="type-body text-ink-200">Add your trip</span>
                </Link>
                <Link href="/request" className="flex items-center justify-between rounded-control border border-line-300 px-4 py-3 transition-colors duration-120 hover:bg-haze-050">
                  <span className="type-label text-ink-400">Date</span>
                  <span className="type-body text-ink-200">Add date</span>
                </Link>
                <Button asChild className="w-full">
                  <Link href="/request">Request this aircraft<ArrowRight size={20} strokeWidth={1.5} /></Link>
                </Button>
              </div>
            </div>
          </aside>
        </div>

        {/* Similar */}
        <section className="mt-16">
          <h2 className="type-h2 text-ink-700">Similar aircraft</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {similarShown.map((x) => (
              <AircraftCard key={x.slug} aircraft={x} />
            ))}
          </div>
        </section>
      </Container>
    </>
  );
}
