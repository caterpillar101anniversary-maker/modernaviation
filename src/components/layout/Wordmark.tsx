import { cn } from "@/lib/cn";
import { brand } from "@/config/brand";

/**
 * The wordmark — Archivo at wdth 120, weight 700, 18px, tracking 0.02em
 * (§11.3). One treatment, used in the header and footer.
 */
export function Wordmark({ dark = false, className }: { dark?: boolean; className?: string }) {
  return (
    <span
      className={cn("select-none leading-none", dark ? "text-paper" : "text-ink-700", className)}
      style={{
        fontFamily: "var(--font-display)",
        fontVariationSettings: '"wdth" 120',
        fontWeight: 700,
        fontSize: 18,
        letterSpacing: "0.02em",
      }}
    >
      {brand.wordmark}
    </span>
  );
}
