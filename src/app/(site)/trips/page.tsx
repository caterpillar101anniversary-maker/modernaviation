"use client";

import { useState } from "react";
import Link from "next/link";
import { Plane } from "lucide-react";
import { PageMasthead } from "@/components/layout/PageMasthead";
import { Container } from "@/components/layout/Container";
import { Tabs } from "@/components/primitives/Tabs";
import { Button } from "@/components/primitives/Button";
import { EmptyState } from "@/components/primitives/EmptyState";
import { ItineraryCard } from "@/components/aviation/ItineraryCard";
import { trips, type TripStatus } from "@/lib/data";

export default function TripsPage() {
  const [tab, setTab] = useState<TripStatus>("upcoming");
  const shown = trips.filter((t) => t.status === tab);

  const count = (s: TripStatus) => trips.filter((t) => t.status === s).length;

  return (
    <>
      <PageMasthead eyebrow="Trips" title="Your trips" description="Every booking, its documents, and what still needs doing before departure." />
      <Container className="py-10">
        <Tabs
          tabs={[
            { value: "upcoming", label: "Upcoming", count: count("upcoming") },
            { value: "past", label: "Past", count: count("past") },
            { value: "cancelled", label: "Cancelled", count: count("cancelled") },
          ]}
          value={tab}
          onChange={setTab}
        />

        <div className="mt-8">
          {shown.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {shown.map((t) => (
                <ItineraryCard key={t.id} trip={t} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Plane}
              title={tab === "upcoming" ? "No upcoming trips" : tab === "past" ? "No past trips yet" : "No cancelled trips"}
              description="When you book a flight it appears here with its itinerary, documents, and next steps."
              action={
                <Button asChild>
                  <Link href="/request">Request a flight</Link>
                </Button>
              }
            />
          )}
        </div>
      </Container>
    </>
  );
}
