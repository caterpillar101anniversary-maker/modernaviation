"use client";

import { useEffect, useRef, useState } from "react";

/**
 * CL-1 — the homepage hero great-circle arc between two airport labels. It is
 * the hero image; there is no photograph (§13.1). Draws on load over --dur-4
 * with --ease-out, origin label at 0ms, destination at 900ms, once per session
 * (§7.4). Honours prefers-reduced-motion by rendering fully drawn immediately.
 */

const SESSION_KEY = "meridian-hero-drawn";

// Endpoints in the 800×360 viewBox. A quadratic arc pulls the line upward the
// way a great-circle route bows toward the pole.
const ORIGIN = { x: 96, y: 268 };
const DEST = { x: 704, y: 116 };
const CONTROL = { x: 400, y: 20 };
const PATH_D = `M${ORIGIN.x} ${ORIGIN.y} Q${CONTROL.x} ${CONTROL.y} ${DEST.x} ${DEST.y}`;

export function HeroCourseArc({
  origin,
  destination,
}: {
  origin: { iata: string; icao: string; city: string };
  destination: { iata: string; icao: string; city: string };
}) {
  const pathRef = useRef<SVGPathElement>(null);
  const [destVisible, setDestVisible] = useState(false);
  const [originVisible, setOriginVisible] = useState(false);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;

    const length = path.getTotalLength();
    path.style.strokeDasharray = `${length}`;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const alreadyDrawn = sessionStorage.getItem(SESSION_KEY) === "1";

    if (reduced || alreadyDrawn) {
      path.style.strokeDashoffset = "0";
      setOriginVisible(true);
      setDestVisible(true);
      return;
    }

    // Start hidden, then draw.
    path.style.strokeDashoffset = `${length}`;
    // Force layout so the transition runs from the offset start.
    void path.getBoundingClientRect();
    path.style.transition = "stroke-dashoffset 1200ms cubic-bezier(0.16, 1, 0.3, 1)";
    path.style.strokeDashoffset = "0";
    sessionStorage.setItem(SESSION_KEY, "1");

    setOriginVisible(true);
    const t = window.setTimeout(() => setDestVisible(true), 900);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div className="relative mx-auto w-full max-w-200">
      <svg
        viewBox="0 0 800 300"
        className="w-full"
        fill="none"
        role="img"
        aria-label={`Route from ${origin.city} (${origin.iata}) to ${destination.city} (${destination.iata})`}
      >
        {/* The committed path — Course Line, course-400 on dark. */}
        <path
          ref={pathRef}
          d={PATH_D}
          stroke="var(--color-course-400)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {/* Endpoint waypoints */}
        <circle cx={ORIGIN.x} cy={ORIGIN.y} r="4" fill="var(--color-course-400)" />
        <circle
          cx={DEST.x}
          cy={DEST.y}
          r="4"
          fill="var(--color-course-400)"
          style={{ opacity: destVisible ? 1 : 0, transition: "opacity 200ms" }}
        />
      </svg>

      {/* Origin label — anchored to the origin waypoint (geometry, not tokens). */}
      <figure
        className="absolute -translate-y-1/2 transition-opacity duration-200"
        style={{ left: "12%", top: "89%", opacity: originVisible ? 1 : 0 }}
      >
        <div className="type-data-lg text-paper">{origin.iata}</div>
        <div className="type-data-sm text-ink-ondark">{origin.icao}</div>
      </figure>

      {/* Destination label — anchored to the destination waypoint. */}
      <figure
        className="absolute -translate-y-1/2 text-right transition-opacity duration-200"
        style={{ right: "12%", top: "39%", opacity: destVisible ? 1 : 0 }}
      >
        <div className="type-data-lg text-paper">{destination.iata}</div>
        <div className="type-data-sm text-ink-ondark">{destination.icao}</div>
      </figure>
    </div>
  );
}
