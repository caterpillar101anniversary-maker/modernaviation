/**
 * Demo domain data for the prototype. Registrations, specs, quotes and trips
 * are representative placeholders; real operator/airframe records and a live
 * airport database replace these before launch (design.md §8.2, §12.2).
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
}

export const airports: Airport[] = [
  { iata: "LOS", icao: "DNMM", name: "Murtala Muhammed", city: "Lagos", country: "Nigeria", kind: "international", runwayM: 3900 },
  { iata: "ABV", icao: "DNAA", name: "Nnamdi Azikiwe", city: "Abuja", country: "Nigeria", kind: "international", runwayM: 3610 },
  { iata: "PHC", icao: "DNPO", name: "Port Harcourt Intl", city: "Port Harcourt", country: "Nigeria", kind: "international", runwayM: 3000 },
  { iata: "KAN", icao: "DNKN", name: "Mallam Aminu Kano", city: "Kano", country: "Nigeria", kind: "international", runwayM: 3320 },
  { iata: "ENU", icao: "DNEN", name: "Akanu Ibiam Intl", city: "Enugu", country: "Nigeria", kind: "domestic", runwayM: 2400 },
  { iata: "QOW", icao: "DNIM", name: "Sam Mbakwe", city: "Owerri", country: "Nigeria", kind: "domestic", runwayM: 2745 },
  { iata: "—", icao: "DNAK", name: "Akwa Ibom (Uyo) GA apron", city: "Uyo", country: "Nigeria", kind: "ga", runwayM: 3600 },
  { iata: "ACC", icao: "DGAA", name: "Kotoka Intl", city: "Accra", country: "Ghana", kind: "international", runwayM: 3400 },
  { iata: "LFW", icao: "DXXX", name: "Lomé–Tokoin", city: "Lomé", country: "Togo", kind: "international", runwayM: 3000 },
  { iata: "COO", icao: "DBBB", name: "Cadjehoun", city: "Cotonou", country: "Benin", kind: "international", runwayM: 2400 },
  { iata: "DKR", icao: "GOBD", name: "Blaise Diagne", city: "Dakar", country: "Senegal", kind: "international", runwayM: 3500 },
  { iata: "JNB", icao: "FAOR", name: "O. R. Tambo", city: "Johannesburg", country: "South Africa", kind: "international", runwayM: 4421 },
  { iata: "LHR", icao: "EGLL", name: "Heathrow", city: "London", country: "United Kingdom", kind: "international", runwayM: 3902 },
  { iata: "—", icao: "EGLF", name: "Farnborough (business aviation)", city: "Farnborough", country: "United Kingdom", kind: "ga", runwayM: 2440 },
  { iata: "—", icao: "LFPB", name: "Paris–Le Bourget (business aviation)", city: "Paris", country: "France", kind: "ga", runwayM: 3000 },
  { iata: "DXB", icao: "OMDB", name: "Dubai Intl", city: "Dubai", country: "UAE", kind: "international", runwayM: 4000 },
  { iata: "—", icao: "KTEB", name: "Teterboro (business aviation)", city: "New York", country: "United States", kind: "ga", runwayM: 2131 },
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
  hourlyNaira: number;
  safety: string;
  part: string;
  amenities: { lavatory: boolean; wifi: boolean; standing: boolean; flatBed: boolean };
}

export const fleet: Aircraft[] = [
  {
    slug: "citation-xls-5n-bqz",
    model: "Citation XLS+",
    registration: "5N-BQZ",
    year: 2019,
    refurbished: 2023,
    category: "Midsize",
    categorySlug: "midsize",
    operator: "Meridian Air Charter",
    seats: 8,
    baggageM3: 2.4,
    rangeKm: 3400,
    speedKmh: 795,
    runwayM: 1070,
    cabinHeightM: 1.73,
    cabinWidthM: 1.68,
    hourlyNaira: 8200000,
    safety: "ARGUS Platinum",
    part: "Part 135",
    amenities: { lavatory: true, wifi: true, standing: false, flatBed: false },
  },
  {
    slug: "phenom-300e-5n-mrd",
    model: "Phenom 300E",
    registration: "5N-MRD",
    year: 2021,
    category: "Light",
    categorySlug: "light",
    operator: "Westgate Aviation",
    seats: 7,
    baggageM3: 2.0,
    rangeKm: 3650,
    speedKmh: 839,
    runwayM: 980,
    cabinHeightM: 1.5,
    cabinWidthM: 1.55,
    hourlyNaira: 6900000,
    safety: "ARGUS Gold",
    part: "Part 135",
    amenities: { lavatory: true, wifi: true, standing: false, flatBed: false },
  },
  {
    slug: "challenger-350-5n-clg",
    model: "Challenger 350",
    registration: "5N-CLG",
    year: 2018,
    refurbished: 2022,
    category: "Super midsize",
    categorySlug: "super-midsize",
    operator: "Meridian Air Charter",
    seats: 9,
    baggageM3: 3.2,
    rangeKm: 5920,
    speedKmh: 850,
    runwayM: 1500,
    cabinHeightM: 1.85,
    cabinWidthM: 2.19,
    hourlyNaira: 12400000,
    safety: "ARGUS Platinum",
    part: "Part 135",
    amenities: { lavatory: true, wifi: true, standing: true, flatBed: true },
  },
  {
    slug: "global-6000-5n-glb",
    model: "Global 6000",
    registration: "5N-GLB",
    year: 2020,
    category: "Ultra-long-range",
    categorySlug: "ultra-long-range",
    operator: "Sahel Executive",
    seats: 13,
    baggageM3: 5.3,
    rangeKm: 11100,
    speedKmh: 900,
    runwayM: 1840,
    cabinHeightM: 1.91,
    cabinWidthM: 2.49,
    hourlyNaira: 21800000,
    safety: "Wyvern Wingman",
    part: "Part 135",
    amenities: { lavatory: true, wifi: true, standing: true, flatBed: true },
  },
  {
    slug: "king-air-350-5n-kab",
    model: "King Air 350",
    registration: "5N-KAB",
    year: 2017,
    category: "Turboprop",
    categorySlug: "turboprop",
    operator: "Westgate Aviation",
    seats: 9,
    baggageM3: 1.5,
    rangeKm: 3300,
    speedKmh: 578,
    runwayM: 1130,
    cabinHeightM: 1.45,
    cabinWidthM: 1.37,
    hourlyNaira: 4200000,
    safety: "ARGUS Gold",
    part: "Part 135",
    amenities: { lavatory: true, wifi: false, standing: false, flatBed: false },
  },
  {
    slug: "legacy-500-5n-lgc",
    model: "Legacy 500",
    registration: "5N-LGC",
    year: 2019,
    category: "Midsize",
    categorySlug: "midsize",
    operator: "Sahel Executive",
    seats: 8,
    baggageM3: 4.0,
    rangeKm: 5600,
    speedKmh: 833,
    runwayM: 1250,
    cabinHeightM: 1.82,
    cabinWidthM: 2.08,
    hourlyNaira: 11200000,
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
  indicativeHourlyNaira: number;
}

export const categories: AircraftCategory[] = [
  { slug: "turboprop", name: "Turboprop", typicalSeats: "6–9", typicalRangeKm: "2,000–3,300", indicativeHourlyNaira: 4200000 },
  { slug: "very-light", name: "Very light", typicalSeats: "4–5", typicalRangeKm: "1,800–2,400", indicativeHourlyNaira: 5400000 },
  { slug: "light", name: "Light", typicalSeats: "6–7", typicalRangeKm: "3,000–3,700", indicativeHourlyNaira: 6900000 },
  { slug: "midsize", name: "Midsize", typicalSeats: "7–9", typicalRangeKm: "3,400–5,600", indicativeHourlyNaira: 8200000 },
  { slug: "super-midsize", name: "Super midsize", typicalSeats: "8–10", typicalRangeKm: "5,500–6,500", indicativeHourlyNaira: 12400000 },
  { slug: "heavy", name: "Heavy", typicalSeats: "10–16", typicalRangeKm: "6,500–8,500", indicativeHourlyNaira: 17600000 },
  { slug: "ultra-long-range", name: "Ultra-long-range", typicalSeats: "12–16", typicalRangeKm: "10,000–14,000", indicativeHourlyNaira: 21800000 },
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
  fromNaira: number;
  charterNaira: number;
}

export const emptyLegs: EmptyLeg[] = [
  {
    id: "el-los-abv-0814",
    from: { iata: "LOS", icao: "DNMM", name: "Murtala Muhammed" },
    to: { iata: "ABV", icao: "DNAA", name: "Nnamdi Azikiwe" },
    durationMinutes: 65,
    aircraft: "Citation XLS+",
    aircraftSlug: "citation-xls-5n-bqz",
    registration: "5N-BQZ",
    category: "Midsize",
    seats: 8,
    windowLabel: "14 Aug · 06:00–11:00 WAT",
    windowDetail: "This aircraft repositions between 06:00 and 11:00 on 14 August. The operator will confirm the exact time.",
    discountPct: 58,
    fromNaira: 3450000,
    charterNaira: 8200000,
  },
  {
    id: "el-abv-phc-0816",
    from: { iata: "ABV", icao: "DNAA", name: "Nnamdi Azikiwe" },
    to: { iata: "PHC", icao: "DNPO", name: "Port Harcourt Intl" },
    durationMinutes: 55,
    aircraft: "Phenom 300E",
    aircraftSlug: "phenom-300e-5n-mrd",
    registration: "5N-MRD",
    category: "Light",
    seats: 7,
    windowLabel: "16 Aug · 09:00–13:00 WAT",
    windowDetail: "This aircraft repositions between 09:00 and 13:00 on 16 August. The operator will confirm the exact time.",
    discountPct: 47,
    fromNaira: 2900000,
    charterNaira: 5500000,
  },
  {
    id: "el-los-acc-0818",
    from: { iata: "LOS", icao: "DNMM", name: "Murtala Muhammed" },
    to: { iata: "ACC", icao: "DGAA", name: "Kotoka Intl" },
    durationMinutes: 70,
    aircraft: "Challenger 350",
    aircraftSlug: "challenger-350-5n-clg",
    registration: "5N-CLG",
    category: "Super midsize",
    seats: 9,
    windowLabel: "18 Aug · 07:30–12:00 WAT",
    windowDetail: "This aircraft repositions between 07:30 and 12:00 on 18 August. The operator will confirm the exact time.",
    discountPct: 61,
    fromNaira: 5100000,
    charterNaira: 13100000,
  },
  {
    id: "el-abv-jnb-0820",
    from: { iata: "ABV", icao: "DNAA", name: "Nnamdi Azikiwe" },
    to: { iata: "JNB", icao: "FAOR", name: "O. R. Tambo" },
    durationMinutes: 320,
    aircraft: "Global 6000",
    aircraftSlug: "global-6000-5n-glb",
    registration: "5N-GLB",
    category: "Ultra-long-range",
    seats: 13,
    windowLabel: "20 Aug · 22:00–02:00 WAT",
    windowDetail: "This aircraft repositions overnight on 20 August. The operator will confirm the exact time.",
    discountPct: 54,
    fromNaira: 18600000,
    charterNaira: 40400000,
  },
  {
    id: "el-los-dkr-0822",
    from: { iata: "LOS", icao: "DNMM", name: "Murtala Muhammed" },
    to: { iata: "DKR", icao: "GOBD", name: "Blaise Diagne" },
    durationMinutes: 215,
    aircraft: "Legacy 500",
    aircraftSlug: "legacy-500-5n-lgc",
    registration: "5N-LGC",
    category: "Midsize",
    seats: 8,
    windowLabel: "22 Aug · 10:00–15:00 WAT",
    windowDetail: "This aircraft repositions between 10:00 and 15:00 on 22 August. The operator will confirm the exact time.",
    discountPct: 49,
    fromNaira: 9400000,
    charterNaira: 18400000,
  },
  {
    id: "el-kan-abv-0824",
    from: { iata: "KAN", icao: "DNKN", name: "Mallam Aminu Kano" },
    to: { iata: "ABV", icao: "DNAA", name: "Nnamdi Azikiwe" },
    durationMinutes: 60,
    aircraft: "King Air 350",
    aircraftSlug: "king-air-350-5n-kab",
    registration: "5N-KAB",
    category: "Turboprop",
    seats: 9,
    windowLabel: "24 Aug · 08:00–12:00 WAT",
    windowDetail: "This aircraft repositions between 08:00 and 12:00 on 24 August. The operator will confirm the exact time.",
    discountPct: 44,
    fromNaira: 2100000,
    charterNaira: 3750000,
  },
];

export function findEmptyLeg(id: string): EmptyLeg | undefined {
  return emptyLegs.find((l) => l.id === id);
}

/* ─────────────────────────── Quotes ─────────────────────────── */
export interface QuoteLine {
  label: string;
  amountNaira: number;
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
  dateLabel: string;
  durationMinutes: number;
  seats: number;
  totalNaira: number;
  breakdown: QuoteLine[];
  inclusions: Inclusion[];
  expiresInMinutes: number;
}

const losAbv = {
  from: { iata: "LOS", icao: "DNMM", name: "Murtala Muhammed", time: "09:40", tz: "WAT" },
  to: { iata: "ABV", icao: "DNAA", name: "Nnamdi Azikiwe", time: "10:45", tz: "WAT" },
};

export const quotes: Quote[] = [
  {
    id: "q-8241",
    operator: "Meridian Air Charter",
    safety: "ARGUS Platinum",
    aircraftSlug: "citation-xls-5n-bqz",
    aircraftModel: "Citation XLS+",
    registration: "5N-BQZ",
    category: "Midsize",
    ...losAbv,
    durationMinutes: 65,
    seats: 8,
    totalNaira: 9450000,
    breakdown: [
      { label: "Aircraft (1.1 block hours)", amountNaira: 8200000 },
      { label: "Fuel surcharge", amountNaira: 420000 },
      { label: "Landing & handling", amountNaira: 380000 },
      { label: "Catering (standard)", amountNaira: 150000 },
      { label: "Taxes & fees", amountNaira: 300000 },
    ],
    inclusions: [
      { label: "Crew, fuel, landing and handling", included: true },
      { label: "Standard catering and soft drinks", included: true },
      { label: "One FBO lounge at each end", included: true },
      { label: "De-icing and overnight crew fees", included: false },
    ],
    expiresInMinutes: 214,
  },
  {
    id: "q-8242",
    operator: "Westgate Aviation",
    safety: "ARGUS Gold",
    aircraftSlug: "phenom-300e-5n-mrd",
    aircraftModel: "Phenom 300E",
    registration: "5N-MRD",
    category: "Light",
    ...losAbv,
    durationMinutes: 68,
    seats: 7,
    totalNaira: 7850000,
    breakdown: [
      { label: "Aircraft (1.1 block hours)", amountNaira: 6900000 },
      { label: "Fuel surcharge", amountNaira: 360000 },
      { label: "Landing & handling", amountNaira: 340000 },
      { label: "Catering (standard)", amountNaira: 120000 },
      { label: "Taxes & fees", amountNaira: 130000 },
    ],
    inclusions: [
      { label: "Crew, fuel, landing and handling", included: true },
      { label: "Standard catering and soft drinks", included: true },
      { label: "One FBO lounge at each end", included: true },
      { label: "Enclosed lavatory", included: true },
    ],
    expiresInMinutes: 47,
  },
  {
    id: "q-8243",
    operator: "Sahel Executive",
    safety: "ARGUS Platinum",
    aircraftSlug: "legacy-500-5n-lgc",
    aircraftModel: "Legacy 500",
    registration: "5N-LGC",
    category: "Midsize",
    ...losAbv,
    durationMinutes: 64,
    seats: 8,
    totalNaira: 12650000,
    breakdown: [
      { label: "Aircraft (1.1 block hours)", amountNaira: 11200000 },
      { label: "Fuel surcharge", amountNaira: 520000 },
      { label: "Landing & handling", amountNaira: 400000 },
      { label: "Catering (premium)", amountNaira: 230000 },
      { label: "Taxes & fees", amountNaira: 300000 },
    ],
    inclusions: [
      { label: "Crew, fuel, landing and handling", included: true },
      { label: "Premium catering and full bar", included: true },
      { label: "Wi-Fi and flat-floor cabin", included: true },
      { label: "De-icing and overnight crew fees", included: false },
    ],
    expiresInMinutes: 356,
  },
];

export function findQuote(id: string): Quote | undefined {
  return quotes.find((q) => q.id === id);
}

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

export const trips: Trip[] = [
  {
    id: "t-clt-7742",
    code: "MRD-7742",
    status: "upcoming",
    from: { iata: "LOS", icao: "DNMM", name: "Murtala Muhammed", time: "09:40", tz: "WAT" },
    to: { iata: "ABV", icao: "DNAA", name: "Nnamdi Azikiwe", time: "10:45", tz: "WAT" },
    dateLabel: "Fri 14 Aug 2026",
    durationMinutes: 65,
    aircraftModel: "Citation XLS+",
    registration: "5N-BQZ",
    operator: "Meridian Air Charter",
    fboFrom: "Evergreen Apple FBO, Lagos",
    fboTo: "ExecuJet FBO, Abuja",
    passengers: [
      { name: "Adaeze Okonkwo", role: "Lead passenger", nationality: "Nigeria", weightKg: 72 },
      { name: "Tunde Bello", role: "Passenger", nationality: "Nigeria", weightKg: 88 },
      { name: "Sarah Whitfield", role: "Passenger", nationality: "United Kingdom", weightKg: 63 },
    ],
    nextAction: { label: "Add passenger manifest", href: "/trips/t-clt-7742#manifest" },
  },
  {
    id: "t-clt-7610",
    code: "MRD-7610",
    status: "upcoming",
    from: { iata: "ABV", icao: "DNAA", name: "Nnamdi Azikiwe", time: "16:20", tz: "WAT" },
    to: { iata: "LOS", icao: "DNMM", name: "Murtala Muhammed", time: "17:25", tz: "WAT" },
    dateLabel: "Sun 16 Aug 2026",
    durationMinutes: 65,
    aircraftModel: "Phenom 300E",
    registration: "5N-MRD",
    operator: "Westgate Aviation",
    fboFrom: "ExecuJet FBO, Abuja",
    fboTo: "Evergreen Apple FBO, Lagos",
    passengers: [{ name: "Adaeze Okonkwo", role: "Lead passenger", nationality: "Nigeria", weightKg: 72 }],
    nextAction: { label: "Complete payment", href: "/quotes/q-8242" },
  },
  {
    id: "t-clt-7433",
    code: "MRD-7433",
    status: "past",
    from: { iata: "LOS", icao: "DNMM", name: "Murtala Muhammed", time: "07:10", tz: "WAT" },
    to: { iata: "PHC", icao: "DNPO", name: "Port Harcourt Intl", time: "08:05", tz: "WAT" },
    dateLabel: "Wed 02 Jul 2026",
    durationMinutes: 55,
    aircraftModel: "King Air 350",
    registration: "5N-KAB",
    operator: "Westgate Aviation",
    fboFrom: "Evergreen Apple FBO, Lagos",
    fboTo: "Aero Contractors GA, Port Harcourt",
    passengers: [{ name: "Adaeze Okonkwo", role: "Lead passenger", nationality: "Nigeria", weightKg: 72 }],
  },
];

export function findTrip(id: string): Trip | undefined {
  return trips.find((t) => t.id === id);
}

/* ─────────────── Customers (email autofill demo) ─────────────── */
// CLAUDE.md: returning customers are recognised by email and their details
// autofill. This is a demo lookup; a real directory replaces it.
export interface Customer {
  email: string;
  name: string;
  phone: string;
  company?: string;
}

export const customers: Customer[] = [
  { email: "adaeze@okonkwogroup.com", name: "Adaeze Okonkwo", phone: "+234 802 118 4420", company: "Okonkwo Group" },
  { email: "t.bello@sabreoil.ng", name: "Tunde Bello", phone: "+234 803 552 7781", company: "Sabre Oil & Gas" },
];

export function findCustomer(email: string): Customer | undefined {
  const e = email.trim().toLowerCase();
  return customers.find((c) => c.email.toLowerCase() === e);
}
