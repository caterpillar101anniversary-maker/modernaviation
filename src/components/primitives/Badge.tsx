import type { ReactNode } from "react";
import { Shield } from "lucide-react";
import { cn } from "@/lib/cn";

// Badges & pills — §11.6. Height 24px, pill radius, data-sm uppercase.
type BadgeTone = "ok" | "pending" | "stop" | "category" | "safety";

const tones: Record<BadgeTone, string> = {
  ok: "bg-ok-050 text-ok-600",
  pending: "bg-warn-050 text-warn-600",
  stop: "bg-stop-050 text-stop-600",
  category: "bg-haze-100 text-ink-600",
  safety: "bg-paper text-ink-700 border border-line-300",
};

export function Badge({
  tone = "category",
  children,
  className,
}: {
  tone?: BadgeTone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center gap-1 rounded-pill px-2.5 type-data-sm uppercase",
        tones[tone],
        className,
      )}
      style={{ letterSpacing: "0.04em" }} // §11.6 badge tracking
    >
      {/* Only the safety badge carries a glyph (§11.6). */}
      {tone === "safety" && <Shield size={14} strokeWidth={1.5} aria-hidden />}
      {children}
    </span>
  );
}
