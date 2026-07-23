import Link from "next/link";
import { MapPin, PlaneTakeoff, CalendarDays, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/primitives/Button";

/**
 * The homepage request bar (§13.1). A single elevated paper panel with
 * From / To / Date / Passengers and a Primary "Request quote". On mobile it
 * collapses to one Primary button that opens the wizard directly.
 *
 * Fields are affordances that open the wizard, where the real airport
 * combobox, calendar, and stepper live — this bar never duplicates them.
 */

function Field({
  icon: Icon,
  label,
  placeholder,
}: {
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  label: string;
  placeholder: string;
}) {
  return (
    <Link
      href="/request"
      className="group flex min-w-0 flex-1 items-center gap-3 rounded-control px-4 py-2 text-left transition-colors duration-120 hover:bg-haze-050"
    >
      <Icon size={20} strokeWidth={1.5} className="shrink-0 text-ink-400" />
      <span className="min-w-0">
        <span className="block type-label text-ink-400">{label}</span>
        <span className="block truncate type-body text-ink-200">{placeholder}</span>
      </span>
    </Link>
  );
}

export function HeroRequestBar() {
  return (
    <div className="mt-10 w-full">
      {/* Desktop / tablet: the full request bar */}
      <div className="hidden rounded-card border border-line-200 bg-paper p-2 shadow-float md:flex md:items-stretch md:gap-1">
        <Field icon={MapPin} label="From" placeholder="City, airport or ICAO" />
        <span className="my-2 w-px self-stretch bg-line-200" aria-hidden />
        <Field icon={PlaneTakeoff} label="To" placeholder="City, airport or ICAO" />
        <span className="my-2 w-px self-stretch bg-line-200" aria-hidden />
        <Field icon={CalendarDays} label="Departure" placeholder="Add date" />
        <span className="my-2 w-px self-stretch bg-line-200" aria-hidden />
        <Field icon={Users} label="Passengers" placeholder="1" />
        <div className="flex items-center pl-1">
          <Button asChild size="lg">
            <Link href="/request">
              Request quote
              <ArrowRight size={20} strokeWidth={1.5} />
            </Link>
          </Button>
        </div>
      </div>

      {/* Mobile: a single Primary opening the wizard */}
      <div className="md:hidden">
        <Button asChild size="lg" className="w-full">
          <Link href="/request">
            Request a flight
            <ArrowRight size={20} strokeWidth={1.5} />
          </Link>
        </Button>
      </div>
    </div>
  );
}
