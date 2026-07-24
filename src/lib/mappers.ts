import type { Booking } from "@prisma/client";
import type { Trip } from "@/lib/data";

interface StoredPax {
  name: string;
  nationality: string;
  weightKg: number;
}

/** Map a persisted Booking row to the Trip shape the itinerary UI renders. */
export function bookingToTrip(b: Booking): Trip {
  const pax = Array.isArray(b.passengers) ? (b.passengers as unknown as StoredPax[]) : [];
  return {
    id: b.id,
    code: b.reference,
    status: b.status as Trip["status"],
    from: { iata: b.fromIata, icao: b.fromIcao, name: b.fromName, time: b.fromTime ?? undefined, tz: b.tz ?? undefined },
    to: { iata: b.toIata, icao: b.toIcao, name: b.toName, time: b.toTime ?? undefined, tz: b.tz ?? undefined },
    dateLabel: b.dateLabel,
    durationMinutes: b.durationMin,
    aircraftModel: b.aircraftModel,
    registration: b.registration,
    operator: b.operator,
    fboFrom: b.fboFrom ?? "",
    fboTo: b.fboTo ?? "",
    passengers: pax.map((p, i) => ({
      name: p.name,
      role: i === 0 ? "Lead passenger" : "Passenger",
      nationality: p.nationality,
      weightKg: p.weightKg,
    })),
  };
}
