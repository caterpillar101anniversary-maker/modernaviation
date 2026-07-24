import Link from "next/link";
import { redirect } from "next/navigation";
import { Plane } from "lucide-react";
import { PageMasthead } from "@/components/layout/PageMasthead";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/primitives/Button";
import { EmptyState } from "@/components/primitives/EmptyState";
import { ItineraryCard } from "@/components/aviation/ItineraryCard";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/session";
import { bookingToTrip } from "@/lib/mappers";

export default async function TripsPage() {
  const user = await getSessionUser();
  if (!user) redirect("/signin");

  const bookings = await prisma.booking.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <PageMasthead
        eyebrow="Trips"
        title="Your trips"
        description="Every booking, its documents, and what still needs doing before departure."
      />
      <Container className="py-10">
        {bookings.length === 0 ? (
          <EmptyState
            icon={Plane}
            title="No trips yet"
            description="When you book a flight it appears here with its itinerary, documents, and next steps."
            action={
              <Button asChild>
                <Link href="/request">Request a flight</Link>
              </Button>
            }
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {bookings.map((b) => (
              <ItineraryCard key={b.id} trip={bookingToTrip(b)} />
            ))}
          </div>
        )}
      </Container>
    </>
  );
}
