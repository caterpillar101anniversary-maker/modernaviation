"use server";

import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/session";

export interface BookingPayload {
  quoteId: string;
  from: { iata: string; icao: string; name: string; time?: string };
  to: { iata: string; icao: string; name: string; time?: string };
  tz?: string;
  dateLabel: string;
  durationMin: number;
  aircraftModel: string;
  registration: string;
  operator: string;
  totalUsd: number;
  paymentMethod: string;
  fboFrom?: string;
  fboTo?: string;
  passengers: { name: string; nationality: string; weightKg: number }[];
}

export type BookingResult =
  | { ok: true; id: string; reference: string }
  | { ok: false; error: string };

function makeReference(from: string, to: string) {
  const suffix = Date.now().toString(36).slice(-5).toUpperCase();
  return `MAC-${suffix}-${from}${to}`;
}

/** Persist a confirmed booking for the signed-in user. */
export async function createBooking(payload: BookingPayload): Promise<BookingResult> {
  const user = await getSessionUser();
  if (!user) return { ok: false, error: "Please sign in to complete your booking." };

  try {
    const booking = await prisma.booking.create({
      data: {
        reference: makeReference(payload.from.iata, payload.to.iata),
        status: "confirmed",
        userId: user.id,
        email: user.email,
        fromIata: payload.from.iata,
        fromIcao: payload.from.icao,
        fromName: payload.from.name,
        fromTime: payload.from.time ?? null,
        toIata: payload.to.iata,
        toIcao: payload.to.icao,
        toName: payload.to.name,
        toTime: payload.to.time ?? null,
        tz: payload.tz ?? null,
        dateLabel: payload.dateLabel,
        durationMin: payload.durationMin,
        aircraftModel: payload.aircraftModel,
        registration: payload.registration,
        operator: payload.operator,
        totalUsd: payload.totalUsd,
        paymentMethod: payload.paymentMethod,
        fboFrom: payload.fboFrom ?? null,
        fboTo: payload.fboTo ?? null,
        passengers: payload.passengers,
      },
    });
    return { ok: true, id: booking.id, reference: booking.reference };
  } catch {
    return { ok: false, error: "Something went wrong saving your booking. Please try again." };
  }
}
