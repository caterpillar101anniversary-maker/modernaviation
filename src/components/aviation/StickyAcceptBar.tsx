"use client";

import Link from "next/link";
import { Button } from "@/components/primitives/Button";
import { ExpiryCountdown } from "@/components/aviation/ExpiryCountdown";
import { formatUsd } from "@/lib/format";

/**
 * Sticky accept bar — §13.3. Total left, expiry countdown between, Accept quote
 * right. Present on mobile and desktop.
 */
export function StickyAcceptBar({
  totalUsd,
  expiresInMinutes,
  bookHref,
}: {
  totalUsd: number;
  expiresInMinutes: number;
  bookHref: string;
}) {
  return (
    <div className="sticky bottom-0 z-40 border-t border-line-200 bg-paper shadow-float">
      <div className="mx-auto flex h-auto max-w-320 flex-col gap-3 px-5 py-3 sm:h-20 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-0 lg:px-10">
        <div className="flex items-center justify-between gap-6 sm:justify-start">
          <div>
            <p className="type-data-lg text-ink-700">{formatUsd(totalUsd)}</p>
            <p className="type-body-sm text-ink-400">all-in · USD</p>
          </div>
          <ExpiryCountdown initialMinutes={expiresInMinutes} />
        </div>
        <Button asChild size="lg" className="max-sm:w-full">
          <Link href={bookHref}>Accept quote</Link>
        </Button>
      </div>
    </div>
  );
}
