"use client";

import { useState } from "react";
import { Info } from "lucide-react";
import { PageMasthead } from "@/components/layout/PageMasthead";
import { Container } from "@/components/layout/Container";
import { SegmentedControl } from "@/components/primitives/Controls";
import { QuoteCard } from "@/components/aviation/QuoteCard";
import { quotes, findAircraft } from "@/lib/data";

type Sort = "price" | "departure" | "age";

export default function QuotesPage() {
  const [sort, setSort] = useState<Sort>("price");

  const sorted = [...quotes].sort((a, b) => {
    if (sort === "price") return a.totalUsd - b.totalUsd;
    if (sort === "age") {
      return (findAircraft(b.aircraftSlug)?.year ?? 0) - (findAircraft(a.aircraftSlug)?.year ?? 0);
    }
    return 0; // departure — same slot in this demo
  });

  return (
    <>
      <PageMasthead
        eyebrow="Quotes"
        title="Your quotes for Charlotte → New York"
        description="Firm, all-in prices from vetted operators. Prices hold only until each quote expires."
      />
      <Container className="pb-24">
        <div className="rounded-card border border-line-200 bg-haze-050 p-4">
          <div className="flex items-start gap-3">
            <Info size={20} strokeWidth={1.5} className="mt-0.5 shrink-0 text-ink-400" />
            <p className="type-body-sm text-ink-600">
              Each quote includes crew, fuel, landing and handling. It excludes de-icing and overnight
              crew fees unless stated. A quote holds only until its countdown reaches zero — accept
              before then to lock the price.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="type-data text-ink-400">{sorted.length} quotes</p>
          <div className="sm:w-80">
            <SegmentedControl
              options={[
                { value: "price", label: "Price" },
                { value: "departure", label: "Departure" },
                { value: "age", label: "Aircraft age" },
              ]}
              value={sort}
              onChange={setSort}
            />
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {sorted.map((q) => (
            <QuoteCard key={q.id} quote={q} />
          ))}
        </div>
      </Container>
    </>
  );
}
