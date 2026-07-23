import Link from "next/link";
import { Card } from "@/components/primitives/Card";
import { Badge } from "@/components/primitives/Badge";
import { AircraftMedia } from "@/components/aviation/AircraftMedia";
import type { Aircraft } from "@/lib/data";
import { formatNaira, formatKm, formatVolume } from "@/lib/format";

/**
 * Variant A — Aircraft card (§11.4). 4:3 media, dense 2×2 spec grid, price,
 * and a safety badge row. Density plus alignment reads as engineering.
 */
function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="type-label text-ink-400">{label}</p>
      <p className="mt-0.5 type-data text-ink-700">{value}</p>
    </div>
  );
}

export function AircraftCard({ aircraft }: { aircraft: Aircraft }) {
  const provenance = [
    aircraft.registration,
    String(aircraft.year),
    aircraft.refurbished ? `refurb ${aircraft.refurbished}` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <Card interactive className="flex flex-col gap-4 p-4 md:p-4">
      <Link href={`/fleet/${aircraft.slug}`} className="flex flex-col gap-4 rounded-card">
        <AircraftMedia registration={aircraft.registration} category={aircraft.category} />

        <div>
          <h3 className="type-h3 text-ink-700">{aircraft.model}</h3>
          <p className="mt-1 type-data-sm text-ink-400">{provenance}</p>
        </div>

        <div className="border-t border-line-200 pt-4">
          <div className="grid grid-cols-2 gap-x-4 gap-y-3">
            <Spec label="PAX" value={String(aircraft.seats)} />
            <Spec label="BAGS" value={formatVolume(aircraft.baggageM3)} />
            <Spec label="RANGE" value={formatKm(aircraft.rangeKm)} />
            <Spec label="SPEED" value={`${aircraft.speedKmh} km/h`} />
          </div>
        </div>

        <div className="border-t border-line-200 pt-4">
          <p className="type-data-lg text-ink-700">from {formatNaira(aircraft.hourlyNaira)}</p>
          <p className="mt-0.5 type-body-sm text-ink-400">per block hour</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge tone="safety">{aircraft.safety}</Badge>
            <Badge tone="ok">{aircraft.part}</Badge>
          </div>
        </div>
      </Link>
    </Card>
  );
}
