"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

/**
 * A live quote-expiry countdown (§13.3). Colour crosses thresholds: ink-400
 * above 6 hours, warn-600 below, stop-600 under 1 hour. Quotes go stale fast —
 * this is never softened.
 */
export function ExpiryCountdown({
  initialMinutes,
  className,
  withLabel = true,
}: {
  initialMinutes: number;
  className?: string;
  withLabel?: boolean;
}) {
  const [seconds, setSeconds] = useState(initialMinutes * 60);

  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, []);

  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const totalMin = seconds / 60;

  const color =
    seconds === 0
      ? "text-stop-600"
      : totalMin < 60
        ? "text-stop-600"
        : totalMin < 360
          ? "text-warn-600"
          : "text-ink-400";

  const text =
    seconds === 0
      ? "Expired"
      : h > 0
        ? `${h}h ${String(m).padStart(2, "0")}m`
        : `${m}:${String(s).padStart(2, "0")}`;

  return (
    <span className={cn("type-data-sm", color, className)} aria-live="polite">
      {withLabel && seconds > 0 && <span className="text-ink-400">Expires in </span>}
      {text}
    </span>
  );
}
