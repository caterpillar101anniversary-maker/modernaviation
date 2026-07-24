"use server";

import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { findAirport } from "@/lib/airports";

/**
 * What the wizard sends. Airports travel as ICAO codes and are resolved
 * server-side, so a stored request always names airports we actually know.
 */
export interface RequestLegPayload {
  fromIcao: string;
  toIcao: string;
  date?: string;
  time?: string;
}

export interface FlightRequestPayload {
  tripType: string;
  legs: RequestLegPayload[];
  flexibility: string;
  passengers: number;
  baggagePieces: number;
  oversized: string[];
  pets: boolean;
  petInfo?: string;
  categories: string[];
  amenities: string[];
  name: string;
  email: string;
  phone?: string;
  company?: string;
}

export type FlightRequestResult =
  | { ok: true; reference: string }
  | { ok: false; error: string };

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

function makeReference() {
  return `MAC-${Date.now().toString(36).slice(-5).toUpperCase()}`;
}

/**
 * Record a trip request for an agent to price and reply to by email.
 *
 * Nothing is quoted or charged here — this is the end of the customer flow,
 * so the only job is to capture the trip accurately and confirm receipt.
 */
export async function createFlightRequest(
  payload: FlightRequestPayload,
): Promise<FlightRequestResult> {
  const email = payload.email?.trim().toLowerCase() ?? "";
  const name = payload.name?.trim() ?? "";
  if (!name) return { ok: false, error: "Enter the name we should put on the quote." };
  if (!EMAIL.test(email)) return { ok: false, error: "Enter a valid email so we can send the quote." };

  // Resolve every leg before storing — an agent has to be able to trust the
  // route on the request without checking it against the customer's typing.
  const legs = [];
  for (const leg of payload.legs ?? []) {
    const from = findAirport(leg.fromIcao ?? "");
    const to = findAirport(leg.toIcao ?? "");
    if (!from || !to) return { ok: false, error: "We don't recognise one of those airports." };
    if (from.icao === to.icao) {
      return { ok: false, error: "A leg can't depart and arrive at the same airport." };
    }
    legs.push({
      fromIata: from.iata,
      fromIcao: from.icao,
      fromName: from.name,
      toIata: to.iata,
      toIcao: to.icao,
      toName: to.name,
      date: leg.date || null,
      time: leg.time || null,
    });
  }
  if (legs.length === 0) return { ok: false, error: "Add an origin and destination for your trip." };

  try {
    const created = await prisma.flightRequest.create({
      data: {
        reference: makeReference(),
        tripType: payload.tripType,
        legs: legs as unknown as Prisma.InputJsonValue,
        flexibility: payload.flexibility,
        passengers: Math.max(1, Math.min(19, Math.round(payload.passengers || 1))),
        baggagePieces: Math.max(0, Math.round(payload.baggagePieces || 0)),
        oversized: (payload.oversized ?? []) as unknown as Prisma.InputJsonValue,
        pets: Boolean(payload.pets),
        petInfo: payload.petInfo?.trim() || null,
        categories: (payload.categories ?? []) as unknown as Prisma.InputJsonValue,
        amenities: (payload.amenities ?? []) as unknown as Prisma.InputJsonValue,
        name,
        email,
        phone: payload.phone?.trim() || null,
        company: payload.company?.trim() || null,
      },
    });
    return { ok: true, reference: created.reference };
  } catch {
    return { ok: false, error: "Something went wrong sending your request. Please try again." };
  }
}
