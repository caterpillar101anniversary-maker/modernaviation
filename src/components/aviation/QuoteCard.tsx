import Link from "next/link";
import { Check, X } from "lucide-react";
import { Card } from "@/components/primitives/Card";
import { Badge } from "@/components/primitives/Badge";
import { Button } from "@/components/primitives/Button";
import { ExpiryCountdown } from "@/components/aviation/ExpiryCountdown";
import type { Quote } from "@/lib/data";
import { formatUsdWithCode } from "@/lib/format";

/**
 * Variant C — Quote card (§11.4). No image. Operator + safety, aircraft, a
 * right-aligned data-xl price, an inclusions list of at most four lines with
 * check/cross glyphs, then expiry countdown + Accept quote.
 */
export function QuoteCard({ quote }: { quote: Quote }) {
  return (
    <Card className="flex flex-col gap-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="type-h3 text-ink-700">{quote.operator}</h3>
            <Badge tone="safety">{quote.safety}</Badge>
          </div>
          <p className="mt-1 type-data-sm text-ink-400">
            {quote.aircraftModel} · {quote.registration} · {quote.category}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="type-data-xl text-ink-700">{formatUsdWithCode(quote.totalUsd).split(" ")[0]}</p>
          <p className="type-data-sm text-ink-400">USD · all-in</p>
        </div>
      </div>

      <ul className="grid gap-2 border-t border-line-200 pt-4">
        {quote.inclusions.slice(0, 4).map((inc) => (
          <li key={inc.label} className="flex items-center gap-2 type-body-sm text-ink-600">
            {inc.included ? (
              <Check size={16} strokeWidth={1.5} className="shrink-0 text-ok-600" />
            ) : (
              <X size={16} strokeWidth={1.5} className="shrink-0 text-ink-400" />
            )}
            <span className={inc.included ? "" : "text-ink-400"}>{inc.label}</span>
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between gap-4 border-t border-line-200 pt-4">
        <ExpiryCountdown initialMinutes={quote.expiresInMinutes} />
        <Button asChild>
          <Link href={`/quotes/${quote.id}`}>Accept quote</Link>
        </Button>
      </div>
    </Card>
  );
}
