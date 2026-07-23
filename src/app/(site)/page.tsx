import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/primitives/Button";
import { SpecTable } from "@/components/primitives/SpecTable";
import { CourseLineStub } from "@/components/aviation/CourseLine";
import { HeroCourseArc } from "@/components/aviation/HeroCourseArc";
import { HeroRequestBar } from "@/components/aviation/HeroRequestBar";
import { TrustRow } from "@/components/aviation/TrustRow";
import { AircraftCard } from "@/components/aviation/AircraftCard";
import { EmptyLegCard } from "@/components/aviation/EmptyLegCard";
import { fleet, emptyLegs } from "@/lib/data";
import { brand } from "@/config/brand";

const steps = [
  {
    n: "01",
    title: "Tell us the trip",
    body: "Route, date, passengers, and any baggage that won't fit a small hold. Four screens, no account.",
  },
  {
    n: "02",
    title: "We quote in twenty minutes",
    body: "We contact vetted operators and return firm, all-in prices — not estimates you have to chase.",
  },
  {
    n: "03",
    title: "Confirm and fly",
    body: "Accept the quote, sign the charter agreement, pay by transfer, and you're on the manifest.",
  },
];

const safetyChecks = [
  { label: "Operator certificate", value: "AOC + Part 135, verified" },
  { label: "Third-party safety audit", value: "ARGUS / Wyvern, current" },
  { label: "Insurance cover", value: "$50M", numeric: true },
  { label: "Pilot-in-command hours", value: "3,500 min", numeric: true },
  { label: "Aircraft age", value: "≤ 15 yrs typical", numeric: true },
];

export default function HomePage() {
  return (
    <>
      {/* ── Section 1 · Hero ─────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-ink-000">
        {/* The single permitted gradient — atmospheric depth only (§3.2). */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "linear-gradient(180deg, var(--color-ink-000) 0%, #0a1220 100%)" }}
          aria-hidden
        />
        <Container className="relative flex min-h-140 flex-col justify-center py-16 lg:min-h-160 lg:py-20">
          <div className="mx-auto flex max-w-200 flex-col items-center text-center">
            <CourseLineStub dark />
            <p className="mt-4 type-label text-ink-ondark">On-demand private charter · West Africa</p>
            <h1 className="mt-4 type-display-1 text-paper">
              Charter that answers in twenty minutes, not tomorrow.
            </h1>
            <p className="mt-5 max-w-140 type-body-lg text-ink-ondark">
              Tell us the trip and get a firm, all-in quote from vetted operators — Lagos, Abuja,
              Accra, Port Harcourt, and long-haul.
            </p>
          </div>

          {/* CL-1 — the hero image is the route, drawn on load. */}
          <div className="mt-12">
            <HeroCourseArc
              origin={{ iata: "LOS", icao: "DNMM", city: "Lagos" }}
              destination={{ iata: "LHR", icao: "EGLL", city: "London" }}
            />
          </div>

          <div className="mx-auto w-full max-w-260">
            <HeroRequestBar />
          </div>
        </Container>
      </section>

      {/* ── Section 2 · Trust row (no padding above) ─────────────── */}
      <TrustRow />

      {/* ── Section 3 · How it works ─────────────────────────────── */}
      <Section
        id="how-it-works"
        eyebrow="How it works"
        title="Three steps from intention to wheels-up."
      >
        <div className="relative">
          <span
            aria-hidden
            className="absolute left-6 top-6 bottom-6 block w-px bg-course-500 md:hidden"
          />
          <span
            aria-hidden
            className="absolute left-6 right-6 top-6 hidden h-px bg-course-500 md:block"
          />
          <ol className="relative z-10 grid gap-10 md:grid-cols-3 md:gap-8">
            {steps.map((step) => (
              <li key={step.n}>
                <span className="grid h-12 w-12 place-items-center rounded-pill border border-line-200 bg-paper type-data-lg text-course-500">
                  {step.n}
                </span>
                <h3 className="mt-5 type-h3 text-ink-700">{step.title}</h3>
                <p className="mt-2 max-w-80 type-body text-ink-600">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      {/* ── Section 4 · Empty legs ───────────────────────────────── */}
      <Section
        eyebrow="Empty legs"
        title="Repositioning flights, priced well below charter."
        lead="When an aircraft flies back empty, that leg is discounted. Book the seats, keep the schedule flexible, and pay a fraction of a full charter."
        className="bg-haze-050"
      >
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {emptyLegs.map((leg) => (
            <EmptyLegCard key={leg.id} leg={leg} />
          ))}
        </div>
        <div className="mt-8">
          <Button asChild variant="secondary">
            <Link href="/empty-legs">
              See all empty legs
              <ArrowRight size={20} strokeWidth={1.5} />
            </Link>
          </Button>
        </div>
      </Section>

      {/* ── Section 5 · Fleet preview ────────────────────────────── */}
      <Section
        eyebrow="Fleet"
        title="Aircraft matched to the trip, not the other way round."
        lead="Passenger count and baggage set the category. Every airframe is on an operator's certificate with its registration on record."
      >
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {fleet.map((aircraft) => (
            <AircraftCard key={aircraft.slug} aircraft={aircraft} />
          ))}
        </div>
        <div className="mt-8">
          <Button asChild variant="secondary">
            <Link href="/fleet">
              See the full fleet
              <ArrowRight size={20} strokeWidth={1.5} />
            </Link>
          </Button>
        </div>
      </Section>

      {/* ── Section 6 · Safety ───────────────────────────────────── */}
      <Section className="bg-haze-050">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <CourseLineStub />
            <p className="mt-3 type-label text-ink-400">Safety</p>
            <h2 className="mt-2 type-h1 text-ink-700">
              Every operator is vetted before a single seat is offered.
            </h2>
            <p className="mt-4 max-w-140 type-body-lg text-ink-600">
              We only quote operators holding a current air operator certificate and an independent
              safety audit. The checks below run on every airframe — and we state, on every quote,
              who is operating your flight.
            </p>
            <div className="mt-6">
              <Button asChild variant="ghost" className="px-0">
                <Link href="/safety">
                  How we vet operators
                  <ArrowRight size={20} strokeWidth={1.5} />
                </Link>
              </Button>
            </div>
          </div>
          <div className="lg:pt-2">
            <SpecTable header={{ label: "Vetting check", value: "Requirement" }} rows={safetyChecks} />
          </div>
        </div>
      </Section>

      {/* ── Section 7 · Closing request band ─────────────────────── */}
      <section className="bg-ink-000 py-18 md:py-28">
        <Container>
          <div className="mx-auto flex max-w-200 flex-col items-center text-center">
            <CourseLineStub dark />
            <h2 className="mt-4 type-display-2 text-paper">
              Tell us the trip. We'll quote it in twenty minutes.
            </h2>
            <p className="mt-4 max-w-140 type-body-lg text-ink-ondark">
              Start the request now, or call dispatch — someone answers around the clock, every day.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row">
              <Button asChild variant="onDark" size="lg">
                <Link href="/request">
                  Request a flight
                  <ArrowRight size={20} strokeWidth={1.5} />
                </Link>
              </Button>
              <a
                href={brand.phoneHref}
                className="inline-flex items-center gap-2 type-data-lg text-paper transition-colors duration-120 hover:text-cyan-400"
              >
                <Phone size={20} strokeWidth={1.5} />
                {brand.phoneDisplay}
              </a>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
