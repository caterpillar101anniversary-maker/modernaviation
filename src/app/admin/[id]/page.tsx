import { notFound } from "next/navigation";
import { AdminLogin } from "@/app/admin/AdminLogin";
import { AdminShell } from "@/app/admin/AdminShell";
import { Badge } from "@/components/primitives/Badge";
import { SpecTable, type SpecRow } from "@/components/primitives/SpecTable";
import { RouteDisplay } from "@/components/aviation/RouteDisplay";
import { prisma } from "@/lib/db";
import { adminPasswordMissing, isAdmin } from "@/lib/admin";
import { categories as fleetCategories } from "@/lib/data";
import {
  FLEXIBILITY_LABEL,
  TRIP_TYPE_LABEL,
  formatSubmitted,
  legWhen,
  readLegs,
  readStrings,
  statusTone,
} from "@/lib/request";

export const metadata = { title: "Admin · Request", robots: { index: false, follow: false } };

const categoryName = (slug: string) =>
  fleetCategories.find((c) => c.slug === slug)?.name ?? slug;

export default async function AdminRequestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await isAdmin())) return <AdminLogin configured={!adminPasswordMissing()} />;

  const { id } = await params;
  const request = await prisma.flightRequest.findUnique({ where: { id } }).catch(() => null);
  if (!request) notFound();

  const legs = readLegs(request.legs);
  const oversized = readStrings(request.oversized);
  const wantedCategories = readStrings(request.categories);
  const amenities = readStrings(request.amenities);

  const contactRows: SpecRow[] = [
    { label: "Name", value: request.name },
    { label: "Email", value: request.email },
    { label: "Phone", value: request.phone ?? "Not given" },
    { label: "Company", value: request.company ?? "Not given" },
  ];

  const tripRows: SpecRow[] = [
    { label: "Trip type", value: TRIP_TYPE_LABEL[request.tripType] ?? request.tripType },
    { label: "Flexibility", value: FLEXIBILITY_LABEL[request.flexibility] ?? request.flexibility },
    { label: "Passengers", value: String(request.passengers), numeric: true },
    { label: "Baggage pieces", value: String(request.baggagePieces), numeric: true },
    { label: "Oversized items", value: oversized.length ? oversized.join(", ") : "None" },
    {
      label: "Pets",
      value: request.pets ? request.petInfo || "Yes, details not given" : "No",
    },
  ];

  const preferenceRows: SpecRow[] = [
    {
      label: "Aircraft category",
      value: wantedCategories.length ? wantedCategories.map(categoryName).join(", ") : "No preference",
    },
    {
      label: "Must-have amenities",
      value: amenities.length ? amenities.join(", ") : "None specified",
    },
  ];

  return (
    <AdminShell
      title={request.reference}
      subtitle={`Submitted ${formatSubmitted(request.createdAt)} · ${request.name}`}
      back={{ href: "/admin", label: "All requests" }}
    >
      <div className="mb-8 flex flex-wrap items-center gap-3">
        <Badge tone={statusTone(request.status)}>{request.status}</Badge>
        <a
          href={`mailto:${request.email}?subject=${encodeURIComponent(
            `Your charter quote — ${request.reference}`,
          )}`}
          className="rounded-control type-body-sm font-semibold text-cyan-600 hover:text-cyan-500"
        >
          Reply to {request.email}
        </a>
      </div>

      <div className="flex flex-col gap-10">
        <section>
          <h2 className="type-h3 text-ink-700">Itinerary</h2>
          <div className="mt-4 flex flex-col gap-4">
            {legs.length === 0 && (
              <p className="type-body-sm text-ink-400">No legs recorded on this request.</p>
            )}
            {legs.map((leg, i) => (
              <div key={i} className="rounded-card border border-line-200 bg-paper p-5">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <span className="type-label text-ink-400">
                    Leg {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="type-data-sm text-ink-600">{legWhen(leg)}</span>
                </div>
                <RouteDisplay
                  from={{ iata: leg.fromIata, icao: leg.fromIcao, name: leg.fromName }}
                  to={{ iata: leg.toIata, icao: leg.toIcao, name: leg.toName }}
                  // Nothing has been priced yet, so there is no flight time to
                  // state — the aircraft that would fly it isn't chosen.
                  stops="Flight time to be quoted"
                />
              </div>
            ))}
          </div>
        </section>

        <div className="grid gap-8 lg:grid-cols-2">
          <section>
            <h2 className="type-h3 text-ink-700">Contact</h2>
            <div className="mt-4">
              <SpecTable rows={contactRows} />
            </div>
          </section>

          <section>
            <h2 className="type-h3 text-ink-700">Trip</h2>
            <div className="mt-4">
              <SpecTable rows={tripRows} />
            </div>
          </section>
        </div>

        <section>
          <h2 className="type-h3 text-ink-700">Aircraft preference</h2>
          <div className="mt-4">
            <SpecTable rows={preferenceRows} />
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
