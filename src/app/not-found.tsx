import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/primitives/Button";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Container className="flex flex-col items-center py-24 text-center">
          {/* The one page where the Course Line encodes nothing — that is the joke (§13.10). */}
          <svg width="220" height="90" viewBox="0 0 220 90" fill="none" aria-hidden className="mb-8">
            <path d="M12 74 Q110 4 208 40" stroke="var(--color-course-500)" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="12" cy="74" r="4" fill="var(--color-course-500)" />
            <circle cx="208" cy="40" r="4" fill="var(--color-course-500)" />
          </svg>
          <h1 className="type-display-2 text-ink-700">That page isn&apos;t on the map.</h1>
          <p className="mt-4 max-w-140 type-body-lg text-ink-400">
            The link may be old or mistyped. Let&apos;s get you back on course.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/">Go to home</Link>
            </Button>
            <Button asChild variant="ghost" size="lg">
              <Link href="/request">Request a flight<ArrowRight size={20} strokeWidth={1.5} /></Link>
            </Button>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
