"use client";

import { useState } from "react";
import { PageMasthead } from "@/components/layout/PageMasthead";
import { Container } from "@/components/layout/Container";
import { Chip } from "@/components/primitives/Controls";
import { AircraftCard } from "@/components/aviation/AircraftCard";
import { fleet, categories } from "@/lib/data";

export default function FleetPage() {
  const [active, setActive] = useState<string | null>(null);
  const shown = active ? fleet.filter((a) => a.categorySlug === active) : fleet;

  return (
    <>
      <PageMasthead
        eyebrow="Fleet"
        title="The aircraft we quote"
        description="Every airframe is on an operator's certificate with its registration on record. Filter by category to see typical seats, range, and hourly rate."
      />

      {/* Sticky filter chip row (§13.4) */}
      <div className="sticky top-14 z-30 border-y border-line-200 bg-paper/95 backdrop-blur lg:top-18">
        <Container>
          <div className="flex gap-2 overflow-x-auto py-3">
            <Chip selected={active === null} onClick={() => setActive(null)}>All</Chip>
            {categories
              .filter((c) => fleet.some((a) => a.categorySlug === c.slug))
              .map((c) => (
                <Chip key={c.slug} selected={active === c.slug} onClick={() => setActive(c.slug)}>
                  {c.name}
                </Chip>
              ))}
          </div>
        </Container>
      </div>

      <Container className="py-12">
        <p className="type-data text-ink-400">{shown.length} aircraft</p>
        <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {shown.map((a) => (
            <AircraftCard key={a.slug} aircraft={a} />
          ))}
        </div>
      </Container>
    </>
  );
}
