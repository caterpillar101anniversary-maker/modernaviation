/**
 * The single source of every figure rendered in the UI (design.md §10, §16.3).
 * No component may call toLocaleString or format currency inline.
 */

/** $12,400 — no space before the figure, no decimals above 1,000 (§4.3). */
export function formatUsd(amount: number): string {
  return `$${groupThousands(amount)}`;
}

/** For quote surfaces, always append the currency code (§4.3). */
export function formatUsdWithCode(amount: number): string {
  return `${formatUsd(amount)} USD`;
}

function groupThousands(amount: number): string {
  return amount.toLocaleString("en-US", {
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

/** A local clock time with a timezone abbreviation: "06:40 EDT" (§4.3). */
export function formatClock(time: string, tz: string): string {
  return `${time} ${tz}`;
}

/**
 * A quote's customer-facing reference: "Q-7K2P0X".
 *
 * Row ids are cuids — fine as keys, unreadable over the phone — so surfaces
 * quote a short, stable tail of the id instead.
 */
export function formatQuoteRef(id: string): string {
  return `Q-${id.slice(-6).toUpperCase()}`;
}

/** Distance in kilometres with a thousands separator: "3,400 km". */
export function formatKm(km: number): string {
  return `${km.toLocaleString("en-US")} km`;
}

/** Baggage volume in cubic metres: "2.4 m³". */
export function formatVolume(cubicMetres: number): string {
  return `${cubicMetres.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} m³`;
}
