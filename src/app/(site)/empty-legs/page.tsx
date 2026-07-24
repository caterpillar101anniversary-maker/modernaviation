import { Bell } from "lucide-react";
import { PageMasthead } from "@/components/layout/PageMasthead";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/primitives/Button";
import { EmptyLegCard } from "@/components/aviation/EmptyLegCard";
import { emptyLegs } from "@/lib/data";

export const metadata = { title: "Empty legs" };

export default function EmptyLegsPage() {
  return (
    <>
      <PageMasthead
        eyebrow="Empty legs"
        title="Empty legs"
        description="An empty leg is a repositioning flight an aircraft flies with no passengers. Book the seats and pay a fraction of a full charter — the trade-off is a flexible window the operator confirms closer to the day."
      />
      <Container className="py-12">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {emptyLegs.slice(0, 6).map((leg) => (
            <EmptyLegCard key={leg.id} leg={leg} />
          ))}
        </div>

        {/* Route-alert panel after the sixth card (§13.5) */}
        <div className="mt-8 flex flex-col items-start gap-4 rounded-card border border-line-200 bg-haze-050 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <Bell size={20} strokeWidth={1.5} className="mt-0.5 shrink-0 text-ink-400" />
            <div>
              <p className="type-h3 text-ink-700">Don&apos;t see your route?</p>
              <p className="mt-1 type-body-sm text-ink-400">Create a route alert and we&apos;ll message you when a matching empty leg is posted.</p>
            </div>
          </div>
          <Button variant="secondary">Create a route alert</Button>
        </div>
      </Container>
    </>
  );
}
