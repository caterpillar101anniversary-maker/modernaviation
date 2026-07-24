import { notFound, redirect } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { BookingClose } from "@/components/request/BookingClose";
import { findQuote, findAirport } from "@/lib/data";
import { getSessionUser } from "@/lib/session";

export default async function BookPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const quote = findQuote(id);
  if (!quote) notFound();

  // A booking is written against a real account — require sign-in.
  const user = await getSessionUser();
  if (!user) redirect("/signin");

  const fromCountry = findAirport(quote.from.icao)?.country;
  const toCountry = findAirport(quote.to.icao)?.country;
  const international = !!fromCountry && !!toCountry && fromCountry !== toCountry;

  return (
    <>
      <div className="border-b border-line-200 bg-haze-100 py-10">
        <Container>
          <p className="type-label text-ink-400">Complete your booking</p>
          <h1 className="mt-2 type-display-2 text-ink-700">Manifest, service, and payment</h1>
          <p className="mt-3 max-w-140 type-body text-ink-600">
            Quote {quote.id.toUpperCase()} accepted. Add your passengers, choose ground and catering,
            then pay to release the aircraft.
          </p>
        </Container>
      </div>
      <BookingClose
        quote={quote}
        international={international}
        user={{ firstName: user.firstName, lastName: user.lastName, email: user.email }}
      />
    </>
  );
}
