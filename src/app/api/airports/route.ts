import { NextResponse } from "next/server";
import { searchAirports } from "@/lib/airports";

/**
 * Airport search. The dataset is far too large to ship to the browser, so the
 * combobox queries this instead and keeps only what the customer picked.
 */
export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") ?? "";
  const limit = Math.min(20, Math.max(1, Number(searchParams.get("limit")) || 8));

  return NextResponse.json(
    { airports: searchAirports(query, limit) },
    // The airport list is static, so let the browser and CDN keep results.
    { headers: { "Cache-Control": "public, max-age=3600, s-maxage=86400" } },
  );
}
