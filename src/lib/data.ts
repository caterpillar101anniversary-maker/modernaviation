/**
 * Demo domain data for the prototype. Registrations, specs, quotes and trips
 * are representative placeholders; real operator/airframe records and a live
 * airport database replace these before launch (design.md §8.2, §12.2).
 *
 * Modern Aviation CLT is based at Charlotte Douglas International (KCLT).
 */
import type { RoutePoint } from "@/components/aviation/RouteDisplay";

/* ─────────────────────────── Airports ─────────────────────────── */
// Includes general-aviation fields and FBO-served airports, not only
// IATA-coded commercial airports (§12.2) — half the value of private charter.
export type AirportKind = "international" | "domestic" | "ga";

export interface Airport {
  iata: string;
  icao: string;
  name: string;
  city: string;
  country: string;
  kind: AirportKind;
  runwayM: number;
  /** Field reference point, decimal degrees — drives great-circle distance. */
  lat: number;
  lng: number;
  /** IANA zone. Stored rather than an abbreviation so DST resolves correctly. */
  tz: string;
}

export const airports: Airport[] = [
  { iata: "CLT", icao: "KCLT", name: "Charlotte Douglas Intl", city: "Charlotte, NC", country: "United States", kind: "international", runwayM: 3048, lat: 35.214, lng: -80.9431, tz: "America/New_York" },
  { iata: "JQF", icao: "KJQF", name: "Concord–Padgett Regional", city: "Concord, NC", country: "United States", kind: "ga", runwayM: 2286, lat: 35.3877, lng: -80.7091, tz: "America/New_York" },
  { iata: "EQY", icao: "KEQY", name: "Charlotte–Monroe Executive", city: "Monroe, NC", country: "United States", kind: "ga", runwayM: 1524, lat: 35.0187, lng: -80.6201, tz: "America/New_York" },
  { iata: "TEB", icao: "KTEB", name: "Teterboro", city: "New York, NJ", country: "United States", kind: "ga", runwayM: 2131, lat: 40.8501, lng: -74.0608, tz: "America/New_York" },
  { iata: "JFK", icao: "KJFK", name: "John F. Kennedy Intl", city: "New York, NY", country: "United States", kind: "international", runwayM: 4423, lat: 40.6413, lng: -73.7781, tz: "America/New_York" },
  { iata: "BED", icao: "KBED", name: "Hanscom Field", city: "Boston, MA", country: "United States", kind: "ga", runwayM: 2130, lat: 42.47, lng: -71.289, tz: "America/New_York" },
  { iata: "IAD", icao: "KIAD", name: "Washington Dulles Intl", city: "Washington, DC", country: "United States", kind: "international", runwayM: 3506, lat: 38.9531, lng: -77.4565, tz: "America/New_York" },
  { iata: "PBI", icao: "KPBI", name: "Palm Beach Intl", city: "West Palm Beach, FL", country: "United States", kind: "international", runwayM: 3213, lat: 26.6832, lng: -80.0956, tz: "America/New_York" },
  { iata: "OPF", icao: "KOPF", name: "Miami–Opa-locka Executive", city: "Miami, FL", country: "United States", kind: "ga", runwayM: 2621, lat: 25.907, lng: -80.2784, tz: "America/New_York" },
  { iata: "MIA", icao: "KMIA", name: "Miami Intl", city: "Miami, FL", country: "United States", kind: "international", runwayM: 4000, lat: 25.7959, lng: -80.287, tz: "America/New_York" },
  { iata: "APF", icao: "KAPF", name: "Naples Municipal", city: "Naples, FL", country: "United States", kind: "ga", runwayM: 1602, lat: 26.1526, lng: -81.7753, tz: "America/New_York" },
  { iata: "HHH", icao: "KHXD", name: "Hilton Head", city: "Hilton Head Island, SC", country: "United States", kind: "ga", runwayM: 1460, lat: 32.2244, lng: -80.6975, tz: "America/New_York" },
  { iata: "ATL", icao: "KATL", name: "Hartsfield–Jackson", city: "Atlanta, GA", country: "United States", kind: "international", runwayM: 3776, lat: 33.6407, lng: -84.4277, tz: "America/New_York" },
  { iata: "FTY", icao: "KFTY", name: "Fulton County Executive", city: "Atlanta, GA", country: "United States", kind: "ga", runwayM: 1817, lat: 33.7791, lng: -84.5214, tz: "America/New_York" },
  { iata: "DAL", icao: "KDAL", name: "Dallas Love Field", city: "Dallas, TX", country: "United States", kind: "domestic", runwayM: 2530, lat: 32.8471, lng: -96.8518, tz: "America/Chicago" },
  { iata: "ASE", icao: "KASE", name: "Aspen / Pitkin County", city: "Aspen, CO", country: "United States", kind: "ga", runwayM: 2374, lat: 39.2232, lng: -106.8687, tz: "America/Denver" },
  { iata: "VNY", icao: "KVNY", name: "Van Nuys", city: "Los Angeles, CA", country: "United States", kind: "ga", runwayM: 2477, lat: 34.2098, lng: -118.4899, tz: "America/Los_Angeles" },
  { iata: "LAS", icao: "KLAS", name: "Harry Reid Intl", city: "Las Vegas, NV", country: "United States", kind: "international", runwayM: 4423, lat: 36.084, lng: -115.1537, tz: "America/Los_Angeles" },
  { iata: "LHR", icao: "EGLL", name: "Heathrow", city: "London", country: "United Kingdom", kind: "international", runwayM: 3902, lat: 51.47, lng: -0.4543, tz: "Europe/London" },
];

export function findAirport(code: string): Airport | undefined {
  const c = code.trim().toUpperCase();
  return airports.find((a) => a.iata === c || a.icao === c);
}

/* ─────────────────────────── Fleet ─────────────────────────── */
export interface Aircraft {
  slug: string;
  model: string;
  registration: string;
  year: number;
  refurbished?: number;
  category: string;
  categorySlug: string;
  operator: string;
  seats: number;
  baggageM3: number;
  rangeKm: number;
  speedKmh: number;
  runwayM: number;
  cabinHeightM: number;
  cabinWidthM: number;
  hourlyUsd: number;
  safety: string;
  part: string;
  amenities: { lavatory: boolean; wifi: boolean; standing: boolean; flatBed: boolean };
}

export const fleet: Aircraft[] = [
  {
    slug: "citation-xls-n720ma",
    model: "Citation XLS+",
    registration: "N720MA",
    year: 2019,
    refurbished: 2023,
    category: "Midsize",
    categorySlug: "midsize",
    operator: "Modern Air Charter",
    seats: 8,
    baggageM3: 2.4,
    rangeKm: 3400,
    speedKmh: 795,
    runwayM: 1070,
    cabinHeightM: 1.73,
    cabinWidthM: 1.68,
    hourlyUsd: 5800,
    safety: "ARGUS Platinum",
    part: "Part 135",
    amenities: { lavatory: true, wifi: true, standing: false, flatBed: false },
  },
  {
    slug: "phenom-300e-n355cj",
    model: "Phenom 300E",
    registration: "N355CJ",
    year: 2021,
    category: "Light",
    categorySlug: "light",
    operator: "Carolina Jet Partners",
    seats: 7,
    baggageM3: 2.0,
    rangeKm: 3650,
    speedKmh: 839,
    runwayM: 980,
    cabinHeightM: 1.5,
    cabinWidthM: 1.55,
    hourlyUsd: 4200,
    safety: "ARGUS Gold",
    part: "Part 135",
    amenities: { lavatory: true, wifi: true, standing: false, flatBed: false },
  },
  {
    slug: "challenger-350-n350qc",
    model: "Challenger 350",
    registration: "N350QC",
    year: 2018,
    refurbished: 2022,
    category: "Super midsize",
    categorySlug: "super-midsize",
    operator: "Modern Air Charter",
    seats: 9,
    baggageM3: 3.2,
    rangeKm: 5920,
    speedKmh: 850,
    runwayM: 1500,
    cabinHeightM: 1.85,
    cabinWidthM: 2.19,
    hourlyUsd: 8600,
    safety: "ARGUS Platinum",
    part: "Part 135",
    amenities: { lavatory: true, wifi: true, standing: true, flatBed: true },
  },
  {
    slug: "global-6000-n600br",
    model: "Global 6000",
    registration: "N600BR",
    year: 2020,
    category: "Ultra-long-range",
    categorySlug: "ultra-long-range",
    operator: "Blue Ridge Aviation",
    seats: 13,
    baggageM3: 5.3,
    rangeKm: 11100,
    speedKmh: 900,
    runwayM: 1840,
    cabinHeightM: 1.91,
    cabinWidthM: 2.49,
    hourlyUsd: 14800,
    safety: "Wyvern Wingman",
    part: "Part 135",
    amenities: { lavatory: true, wifi: true, standing: true, flatBed: true },
  },
  {
    slug: "king-air-350-n350ka",
    model: "King Air 350",
    registration: "N350KA",
    year: 2017,
    category: "Turboprop",
    categorySlug: "turboprop",
    operator: "Carolina Jet Partners",
    seats: 9,
    baggageM3: 1.5,
    rangeKm: 3300,
    speedKmh: 578,
    runwayM: 1130,
    cabinHeightM: 1.45,
    cabinWidthM: 1.37,
    hourlyUsd: 2900,
    safety: "ARGUS Gold",
    part: "Part 135",
    amenities: { lavatory: true, wifi: false, standing: false, flatBed: false },
  },
  {
    slug: "legacy-500-n500qc",
    model: "Legacy 500",
    registration: "N500QC",
    year: 2019,
    category: "Midsize",
    categorySlug: "midsize",
    operator: "Queen City Air",
    seats: 8,
    baggageM3: 4.0,
    rangeKm: 5600,
    speedKmh: 833,
    runwayM: 1250,
    cabinHeightM: 1.82,
    cabinWidthM: 2.08,
    hourlyUsd: 7600,
    safety: "ARGUS Platinum",
    part: "Part 135",
    amenities: { lavatory: true, wifi: true, standing: true, flatBed: false },
  },
];

export function findAircraft(slug: string): Aircraft | undefined {
  return fleet.find((a) => a.slug === slug);
}

export interface AircraftCategory {
  slug: string;
  name: string;
  typicalSeats: string;
  typicalRangeKm: string;
  indicativeHourlyUsd: number;
}

export const categories: AircraftCategory[] = [
  { slug: "turboprop", name: "Turboprop", typicalSeats: "6–9", typicalRangeKm: "2,000–3,300", indicativeHourlyUsd: 2900 },
  { slug: "very-light", name: "Very light", typicalSeats: "4–5", typicalRangeKm: "1,800–2,400", indicativeHourlyUsd: 3600 },
  { slug: "light", name: "Light", typicalSeats: "6–7", typicalRangeKm: "3,000–3,700", indicativeHourlyUsd: 4200 },
  { slug: "midsize", name: "Midsize", typicalSeats: "7–9", typicalRangeKm: "3,400–5,600", indicativeHourlyUsd: 5800 },
  { slug: "super-midsize", name: "Super midsize", typicalSeats: "8–10", typicalRangeKm: "5,500–6,500", indicativeHourlyUsd: 8600 },
  { slug: "heavy", name: "Heavy", typicalSeats: "10–16", typicalRangeKm: "6,500–8,500", indicativeHourlyUsd: 11800 },
  { slug: "ultra-long-range", name: "Ultra-long-range", typicalSeats: "12–16", typicalRangeKm: "10,000–14,000", indicativeHourlyUsd: 14800 },
];

/* ─────────────────────────── Empty legs ─────────────────────────── */
export interface EmptyLeg {
  id: string;
  from: RoutePoint;
  to: RoutePoint;
  durationMinutes: number;
  aircraft: string;
  aircraftSlug: string;
  registration: string;
  category: string;
  seats: number;
  windowLabel: string;
  windowDetail: string;
  discountPct: number;
  fromUsd: number;
  charterUsd: number;
}

export const emptyLegs: EmptyLeg[] = [
  {
    id: "el-clt-teb-0814",
    from: { iata: "CLT", icao: "KCLT", name: "Charlotte Douglas Intl" },
    to: { iata: "TEB", icao: "KTEB", name: "Teterboro" },
    durationMinutes: 95,
    aircraft: "Citation XLS+",
    aircraftSlug: "citation-xls-n720ma",
    registration: "N720MA",
    category: "Midsize",
    seats: 8,
    windowLabel: "14 Aug · 06:00–11:00 EDT",
    windowDetail: "This aircraft repositions between 06:00 and 11:00 on 14 August. The operator will confirm the exact time.",
    discountPct: 58,
    fromUsd: 6900,
    charterUsd: 16400,
  },
  {
    id: "el-teb-pbi-0816",
    from: { iata: "TEB", icao: "KTEB", name: "Teterboro" },
    to: { iata: "PBI", icao: "KPBI", name: "Palm Beach Intl" },
    durationMinutes: 165,
    aircraft: "Phenom 300E",
    aircraftSlug: "phenom-300e-n355cj",
    registration: "N355CJ",
    category: "Light",
    seats: 7,
    windowLabel: "16 Aug · 09:00–13:00 EDT",
    windowDetail: "This aircraft repositions between 09:00 and 13:00 on 16 August. The operator will confirm the exact time.",
    discountPct: 47,
    fromUsd: 8200,
    charterUsd: 15500,
  },
  {
    id: "el-clt-ase-0818",
    from: { iata: "CLT", icao: "KCLT", name: "Charlotte Douglas Intl" },
    to: { iata: "ASE", icao: "KASE", name: "Aspen / Pitkin County" },
    durationMinutes: 210,
    aircraft: "Challenger 350",
    aircraftSlug: "challenger-350-n350qc",
    registration: "N350QC",
    category: "Super midsize",
    seats: 9,
    windowLabel: "18 Aug · 07:30–12:00 EDT",
    windowDetail: "This aircraft repositions between 07:30 and 12:00 on 18 August. The operator will confirm the exact time.",
    discountPct: 61,
    fromUsd: 14500,
    charterUsd: 37200,
  },
  {
    id: "el-mia-clt-0820",
    from: { iata: "MIA", icao: "KMIA", name: "Miami Intl" },
    to: { iata: "CLT", icao: "KCLT", name: "Charlotte Douglas Intl" },
    durationMinutes: 150,
    aircraft: "Global 6000",
    aircraftSlug: "global-6000-n600br",
    registration: "N600BR",
    category: "Ultra-long-range",
    seats: 13,
    windowLabel: "20 Aug · 22:00–02:00 EDT",
    windowDetail: "This aircraft repositions overnight on 20 August. The operator will confirm the exact time.",
    discountPct: 54,
    fromUsd: 22000,
    charterUsd: 47800,
  },
  {
    id: "el-clt-dal-0822",
    from: { iata: "CLT", icao: "KCLT", name: "Charlotte Douglas Intl" },
    to: { iata: "DAL", icao: "KDAL", name: "Dallas Love Field" },
    durationMinutes: 165,
    aircraft: "Legacy 500",
    aircraftSlug: "legacy-500-n500qc",
    registration: "N500QC",
    category: "Midsize",
    seats: 8,
    windowLabel: "22 Aug · 10:00–15:00 EDT",
    windowDetail: "This aircraft repositions between 10:00 and 15:00 on 22 August. The operator will confirm the exact time.",
    discountPct: 49,
    fromUsd: 12800,
    charterUsd: 25100,
  },
  {
    id: "el-atl-clt-0824",
    from: { iata: "ATL", icao: "KATL", name: "Hartsfield–Jackson" },
    to: { iata: "CLT", icao: "KCLT", name: "Charlotte Douglas Intl" },
    durationMinutes: 55,
    aircraft: "King Air 350",
    aircraftSlug: "king-air-350-n350ka",
    registration: "N350KA",
    category: "Turboprop",
    seats: 9,
    windowLabel: "24 Aug · 08:00–12:00 EDT",
    windowDetail: "This aircraft repositions between 08:00 and 12:00 on 24 August. The operator will confirm the exact time.",
    discountPct: 44,
    fromUsd: 3400,
    charterUsd: 6100,
  },
];

export function findEmptyLeg(id: string): EmptyLeg | undefined {
  return emptyLegs.find((l) => l.id === id);
}

/* ─────────────────────────── Quotes ─────────────────────────── */
export interface QuoteLine {
  label: string;
  amountUsd: number;
}
export interface Inclusion {
  label: string;
  included: boolean;
}
export interface Quote {
  id: string;
  operator: string;
  safety: string;
  aircraftSlug: string;
  aircraftModel: string;
  registration: string;
  category: string;
  from: RoutePoint;
  to: RoutePoint;
  dateLabel?: string;
  durationMinutes: number;
  seats: number;
  totalUsd: number;
  breakdown: QuoteLine[];
  inclusions: Inclusion[];
  expiresInMinutes: number;
}

// Quotes are generated per request and stored in Postgres — see
// generateQuotes in src/lib/quote.ts and the createQuoteRequest action. The
// Quote type above describes the shape the quote UI renders.

/* ─────────────────────────── Trips ─────────────────────────── */
export type TripStatus = "upcoming" | "past" | "cancelled";
export interface Passenger {
  name: string;
  role: string;
  nationality: string;
  weightKg: number;
}
export interface Trip {
  id: string;
  code: string;
  status: TripStatus;
  from: RoutePoint;
  to: RoutePoint;
  dateLabel: string;
  durationMinutes: number;
  aircraftModel: string;
  registration: string;
  operator: string;
  fboFrom: string;
  fboTo: string;
  passengers: Passenger[];
  nextAction?: { label: string; href: string };
}

// Trips are real bookings stored in Postgres — see src/lib/mappers.ts
// (bookingToTrip) and the createBooking action. The Trip/Passenger types above
// describe the shape the itinerary UI renders.

// Returning users are recognised by email against the real users table — see
// lookupUserByEmail in src/app/actions/auth.ts (backed by Postgres via Prisma).
