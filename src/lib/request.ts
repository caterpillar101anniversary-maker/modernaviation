/**
 * The shape of a stored trip request, as the admin views read it back.
 *
 * `legs` is a Json column, so it arrives untyped — these helpers are the one
 * place that knows its shape and tolerates rows that predate a field.
 */

export interface StoredLeg {
  fromIata: string;
  fromIcao: string;
  fromName: string;
  toIata: string;
  toIcao: string;
  toName: string;
  date: string | null;
  time: string | null;
}

export function readLegs(value: unknown): StoredLeg[] {
  return Array.isArray(value) ? (value as StoredLeg[]) : [];
}

/** Json string arrays (oversized, categories, amenities) read back safely. */
export function readStrings(value: unknown): string[] {
  return Array.isArray(value) ? (value as string[]).filter((v) => typeof v === "string") : [];
}

/** "CLT → ASE" for one leg, "CLT → ASE +1 leg" when there are more. */
export function routeSummary(legs: StoredLeg[]): string {
  if (legs.length === 0) return "—";
  const [first] = legs;
  const base = `${first.fromIata} → ${first.toIata}`;
  if (legs.length === 1) return base;
  const extra = legs.length - 1;
  return `${base} +${extra} ${extra === 1 ? "leg" : "legs"}`;
}

/** "9 Dec 2026, 09:30" — departure as the customer entered it, local to origin. */
export function legWhen(leg: StoredLeg): string {
  if (!leg.date) return "Date to confirm";
  const [y, m, d] = leg.date.split("-").map(Number);
  const label = new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-GB", {
    timeZone: "UTC",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  return leg.time ? `${label}, ${leg.time}` : label;
}

export const TRIP_TYPE_LABEL: Record<string, string> = {
  "one-way": "One way",
  return: "Return",
  "multi-leg": "Multi-leg",
};

export const FLEXIBILITY_LABEL: Record<string, string> = {
  exact: "Exact times",
  "2h": "±2 hours",
  "1d": "±1 day",
};

/**
 * Status → badge tone. A new request is awaiting action, so it reads as
 * pending; quoted is done; closed is neutral. The `safety` tone is reserved
 * for operator ratings (§11.6) and never used here.
 */
export function statusTone(status: string): "pending" | "ok" | "category" {
  if (status === "new") return "pending";
  if (status === "quoted") return "ok";
  return "category";
}

/** Submission time, shown in the operation's own timezone. */
export function formatSubmitted(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "America/New_York",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}
