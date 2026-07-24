import { notFound } from "next/navigation";
import { ShieldCheck, FileCheck2, Umbrella, Clock } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Badge } from "@/components/primitives/Badge";
import { SpecTable } from "@/components/primitives/SpecTable";
import { RouteDisplay } from "@/components/aviation/RouteDisplay";
import { AircraftMedia } from "@/components/aviation/AircraftMedia";
import { CancellationPolicy } from "@/components/aviation/CancellationPolicy";
import { StickyAcceptBar } from "@/components/aviation/StickyAcceptBar";
import { ExpiryCountdown } from "@/components/aviation/ExpiryCountdown";
import { quotes, findQuote, findAircraft } from "@/lib/data";
import { formatUsd } from "@/lib/format";

export function generateStaticParams() {
  return quotes.map((q) => ({ id: q.id }));
}

export default async function QuoteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const quote = findQuote(id);
  if (!quote) notFound();
  const aircraft = findAircraft(quote.aircraftSlug);

  const breakdownRows = quote.breakdown.map((b) => ({
    label: b.label,
    value: formatUsd(b.amountUsd),
    numeric: true,
  }));

  return (
    <>
      {/* Dark presentation surface — the price lives on dark (§13.3, P1). */}
      <section className="bg-ink-000">
        <Container className="py-14 lg:py-16">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
            <div>
              <div className="flex items-center gap-2">
                <p className="type-label text-ink-ondark">{quote.operator}</p>
                <Badge tone="safety">{quote.safety}</Badge>
              </div>
              <h1 className="mt-3 type-display-2 text-paper">
                {quote.aircraftModel}
              </h1>
              <p className="mt-2 type-data text-ink-ondark">
                {quote.registration} · {quote.category} · {quote.seats} seats
              </p>
              <div className="mt-8 max-w-140">
                <RouteDisplay
                  from={quote.from}
                  to={quote.to}
                  durationMinutes={quote.durationMinutes}
                  dark
                />
              </div>
            </div>
            <div className="rounded-card border border-ink-800 bg-ink-900 p-6">
              <p className="type-label text-ink-ondark">Total, all-in</p>
              <p className="mt-2 type-data-xl text-paper">{formatUsd(quote.totalUsd)}</p>
              <p className="mt-1 type-data-sm text-ink-ondark">USD · quote {quote.id.toUpperCase()}</p>
              <div className="mt-4 flex items-center gap-2 border-t border-ink-800 pt-4">
                <Clock size={16} strokeWidth={1.5} className="text-ink-ondark" />
                <ExpiryCountdown initialMinutes={quote.expiresInMinutes} />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Trust row above every quote (§11.12) */}
      <div className="border-b border-line-200 bg-haze-050">
        <Container>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-5 py-5 md:flex md:h-18 md:items-center md:justify-between md:gap-6 md:py-0">
            {[
              { icon: FileCheck2, label: "Operator", value: quote.operator },
              { icon: ShieldCheck, label: "Safety rating", value: quote.safety },
              { icon: Umbrella, label: "Insurance", value: "$50M liability" },
              { icon: Clock, label: "Aircraft year", value: String(aircraft?.year ?? "—") },
            ].map(({ icon: Icon, label, value }) => (
              <li key={label} className="flex items-center gap-3">
                <Icon size={20} strokeWidth={1.5} className="shrink-0 text-ink-400" aria-hidden />
                <div className="min-w-0">
                  <p className="type-label text-ink-400">{label}</p>
                  <p className="type-data text-ink-700 truncate">{value}</p>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </div>

      <Container className="py-14 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
          <div className="flex flex-col gap-12">
            <section>
              <h2 className="type-h2 text-ink-700">Cost breakdown</h2>
              <p className="mt-2 type-body text-ink-600">
                Everything is included below. There are no line items added after you accept.
              </p>
              <div className="mt-6">
                <SpecTable header={{ label: "Item", value: "Amount (USD)" }} rows={breakdownRows} />
                <div className="mt-3 flex items-center justify-between rounded-card bg-haze-050 px-4 py-3">
                  <span className="type-label text-ink-600">Total</span>
                  <span className="type-data-lg text-ink-700">{formatUsd(quote.totalUsd)}</span>
                </div>
              </div>
            </section>

            <section>
              <h2 className="type-h2 text-ink-700">Aircraft</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <AircraftMedia registration={quote.registration} category={quote.category} ratio="16/9" className="sm:col-span-2" />
                <AircraftMedia registration={quote.registration} category="Cabin" ratio="4/3" />
                <AircraftMedia registration={quote.registration} category="Galley" ratio="4/3" />
              </div>
              {aircraft && (
                <div className="mt-6">
                  <SpecTable
                    rows={[
                      { label: "Cabin height", value: `${aircraft.cabinHeightM} m`, numeric: true },
                      { label: "Cabin width", value: `${aircraft.cabinWidthM} m`, numeric: true },
                      { label: "Baggage", value: `${aircraft.baggageM3} m³`, numeric: true },
                      { label: "Range", value: `${aircraft.rangeKm.toLocaleString()} km`, numeric: true },
                      { label: "Runway required", value: `${aircraft.runwayM.toLocaleString()} m`, numeric: true },
                    ]}
                  />
                </div>
              )}
            </section>

            <section>
              <h2 className="type-h2 text-ink-700">Cancellation policy</h2>
              <div className="mt-6">
                <CancellationPolicy />
              </div>
            </section>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-card border border-line-200 bg-paper p-6">
              <h3 className="type-h3 text-ink-700">What&apos;s included</h3>
              <ul className="mt-4 flex flex-col gap-2">
                {quote.inclusions.map((inc) => (
                  <li key={inc.label} className="flex items-start gap-2 type-body-sm">
                    <span className={inc.included ? "text-ok-600" : "text-ink-400"}>{inc.included ? "✓" : "✕"}</span>
                    <span className={inc.included ? "text-ink-600" : "text-ink-400"}>{inc.label}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 border-t border-line-200 pt-4 type-body-sm text-ink-400">
                Includes crew, fuel, landing and handling. Excludes de-icing and overnight crew fees.
              </p>
            </div>
          </aside>
        </div>
      </Container>

      <StickyAcceptBar
        totalUsd={quote.totalUsd}
        expiresInMinutes={quote.expiresInMinutes}
        bookHref={`/quotes/${quote.id}/book`}
      />
    </>
  );
}
