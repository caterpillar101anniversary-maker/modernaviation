/**
 * The single source of every figure rendered in the UI (design.md §10, §16.3).
 * No component may call toLocaleString or format currency inline.
 */

/** ₦18,450,000 — no space before the figure, no decimals above 1,000 (§4.3). */
export function formatNaira(amount: number): string {
  return `₦${groupThousands(amount)}`;
}

/** $12,400 — same rules as naira. */
export function formatUsd(amount: number): string {
  return `$${groupThousands(amount)}`;
}

/** For quote surfaces, always append the currency code (§4.3). */
export function formatNairaWithCode(amount: number): string {
  return `${formatNaira(amount)} NGN`;
}

function groupThousands(amount: number): string {
  const rounded = amount >= 1000 ? Math.round(amount) : amount;
  return rounded.toLocaleString("en-US", {
    maximumFractionDigits: amount >= 1000 ? 0 : 2,
  });
}

/** 1h 05m · from a minute count. Used in Route Display and itineraries. */
export function formatDuration(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes}m`;
  return `${hours}h ${String(minutes).padStart(2, "0")}m`;
}

/** "Departs in 4 hours 20 minutes" — numbers stated, not softened (§9). */
export function formatCountdownLong(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours} ${hours === 1 ? "hour" : "hours"}`);
  parts.push(`${minutes} ${minutes === 1 ? "minute" : "minutes"}`);
  return parts.join(" ");
}

/** A local clock time with a timezone abbreviation: "06:40 WAT" (§4.3). */
export function formatClock(time: string, tz: string): string {
  return `${time} ${tz}`;
}

/** Distance in kilometres with a thousands separator: "3,400 km". */
export function formatKm(km: number): string {
  return `${km.toLocaleString("en-US")} km`;
}

/** Baggage volume in cubic metres: "2.4 m³". */
export function formatVolume(cubicMetres: number): string {
  return `${cubicMetres.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} m³`;
}
