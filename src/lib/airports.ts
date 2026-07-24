import data from "@/data/us-airports.json";

/**
 * The US airport database (§12.2).
 *
 * Every US airport with an open, hard-surface runway of at least 3,000 ft —
 * 4,036 fields, from Denver International down to the GA strips airlines never
 * touch. Sourced from OurAirports (public domain).
 *
 * **Server-only.** The dataset is ~670KB, far too large to ship to a browser,
 * so nothing here may be imported by a client component. Client code searches
 * through `/api/airports` instead and holds only the airports a customer picked.
 */

export type AirportKind = "international" | "domestic" | "ga";

export interface Airport {
  /** IATA code, or "—" for the many GA fields that have none. */
  iata: string;
  icao: string;
  name: string;
  /** "Charlotte, NC" — municipality and state, which is how people search. */
  city: string;
  country: string;
  kind: AirportKind;
  /** Longest hard-surface runway, metres. Drives the aircraft-fit warning. */
  runwayM: number;
  lat: number;
  lng: number;
}

export const airports = data as Airport[];

const byCode = new Map<string, Airport>();
for (const airport of airports) {
  byCode.set(airport.icao, airport);
  if (airport.iata !== "—") byCode.set(airport.iata, airport);
}

/** Look up by ICAO or IATA. Codes are the only identifier we trust from a client. */
export function findAirport(code: string): Airport | undefined {
  return byCode.get(code.trim().toUpperCase());
}

/** Shown before anyone types — the home base first, then notable destinations. */
const SUGGESTED = ["KCLT", "KJQF", "KEQY", "KTEB", "KPBI", "KASE", "KVNY", "KOPF"];

const suggested = SUGGESTED.map((c) => byCode.get(c)).filter((a): a is Airport => Boolean(a));

/** Lowercased fields, built once, so a search is a plain scan with no allocation. */
const index = airports.map((airport) => ({
  airport,
  iata: airport.iata.toLowerCase(),
  icao: airport.icao.toLowerCase(),
  name: airport.name.toLowerCase(),
  city: airport.city.toLowerCase(),
}));

type Indexed = (typeof index)[number];

/** No match at all — anything scoring this is dropped. */
const NO_MATCH = 99;

/**
 * Rank a match so the airport someone means comes first.
 *
 * An exact code match always wins — typing "CLT" must not surface "Clanton"
 * ahead of Charlotte. After that, prefix matches beat mid-string ones.
 */
function score(entry: Indexed, q: string): number {
  if (entry.iata === q || entry.icao === q) return 0;
  // US ICAO codes are the IATA code prefixed with K, so a 3-letter query
  // should still find KCLT when the field has no IATA code of its own.
  if (q.length === 3 && entry.icao.length === 4 && entry.icao.endsWith(q)) return 1;
  if (entry.city.startsWith(q)) return 2;
  if (entry.name.startsWith(q)) return 3;
  if (entry.iata.startsWith(q) || entry.icao.startsWith(q)) return 4;
  if (entry.city.includes(q)) return 5;
  if (entry.name.includes(q)) return 6;
  return NO_MATCH;
}

const KIND_RANK: Record<AirportKind, number> = { international: 0, domestic: 1, ga: 2 };

/**
 * Search by IATA, ICAO, city, state or airport name.
 *
 * Scans the whole list rather than stopping early — 4,000 pre-lowercased rows
 * cost well under a millisecond, and bailing out could drop the exact match a
 * customer typed in favour of an earlier partial one.
 */
export function searchAirports(query: string, limit = 8): Airport[] {
  const q = query.trim().toLowerCase();
  if (!q) return suggested.slice(0, limit);

  const matches: { entry: Indexed; rank: number }[] = [];
  for (const entry of index) {
    const rank = score(entry, q);
    if (rank !== NO_MATCH) matches.push({ entry, rank });
  }

  matches.sort(
    (a, b) =>
      a.rank - b.rank ||
      KIND_RANK[a.entry.airport.kind] - KIND_RANK[b.entry.airport.kind] ||
      b.entry.airport.runwayM - a.entry.airport.runwayM,
  );
  return matches.slice(0, limit).map((m) => m.entry.airport);
}
