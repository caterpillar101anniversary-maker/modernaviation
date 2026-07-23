import { Plane } from "lucide-react";
import { cn } from "@/lib/cn";
import { Badge } from "@/components/primitives/Badge";

/**
 * Honest airframe-media placeholder. design.md §8.2 forbids stock and renders
 * on aircraft cards — every image must be the actual airframe with the
 * registration stated. Until real photography is supplied, this renders a
 * deliberate technical placeholder that states the tail number rather than
 * faking a jet-at-sunset. Media containers always use radius-window (§8.2).
 */
export function AircraftMedia({
  registration,
  category,
  ratio = "4/3",
  className,
}: {
  registration: string;
  category: string;
  ratio?: "4/3" | "16/9";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-window bg-haze-050 border border-line-200",
        className,
      )}
      style={{ aspectRatio: ratio.replace("/", " / ") }}
    >
      {/* Placemark — a Lucide glyph, not a photograph. */}
      <div className="absolute inset-0 grid place-items-center">
        <Plane size={44} strokeWidth={1.5} className="text-ink-200 -rotate-45" aria-hidden />
      </div>

      {/* Category pill, overlaid top-left (§11.4 Variant A). */}
      <div className="absolute left-3 top-3">
        <Badge tone="category">{category}</Badge>
      </div>

      {/* Registration + honest caption, bottom-left. */}
      <div className="absolute bottom-3 left-3">
        <p className="type-data-sm text-ink-600">{registration}</p>
        <p className="type-body-sm text-ink-400">Airframe photo on request</p>
      </div>
    </div>
  );
}
