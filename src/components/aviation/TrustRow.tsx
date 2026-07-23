import { ShieldCheck, FileCheck2, Umbrella, CalendarClock } from "lucide-react";
import { Container } from "@/components/layout/Container";

/**
 * Trust row — §11.12. One horizontal row, haze-050 band, 72px tall, four
 * items. Each is a 20px glyph + label + data. Never a carousel, never
 * logos-of-companies-we-work-with.
 */

const items = [
  { icon: FileCheck2, label: "Operator certificate", value: "AOC verified" },
  { icon: ShieldCheck, label: "Safety rating", value: "ARGUS / Wyvern" },
  { icon: Umbrella, label: "Insurance cover", value: "$50M liability" },
  { icon: CalendarClock, label: "Operating since", value: "2016" },
];

export function TrustRow() {
  return (
    <div className="bg-haze-050 border-y border-line-200">
      <Container>
        <ul className="grid grid-cols-2 gap-x-6 gap-y-5 py-5 md:flex md:h-18 md:items-center md:justify-between md:gap-6 md:py-0">
          {items.map(({ icon: Icon, label, value }) => (
            <li key={label} className="flex items-center gap-3">
              <Icon size={20} strokeWidth={1.5} className="shrink-0 text-ink-400" aria-hidden />
              <div className="min-w-0">
                <p className="type-label text-ink-400">{label}</p>
                <p className="type-data text-ink-700">{value}</p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </div>
  );
}
