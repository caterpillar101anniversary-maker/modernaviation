"use client";

import { useEffect, useRef, useState } from "react";
import { Plane } from "lucide-react";
import { cn } from "@/lib/cn";
import type { Airport } from "@/lib/airports";
import { formatKm } from "@/lib/format";

/**
 * Airport combobox — §12.2. Matches IATA, ICAO, city, state and airport name
 * across every US airport with a usable hard runway, general-aviation fields
 * included — not only IATA commercial airports. Each row aligns the code in a
 * fixed column. Full keyboard operability.
 *
 * The database is far too large to ship to the browser, so results come from
 * `/api/airports` as the customer types. This is a type-only import of
 * `Airport`, which erases at build time and keeps the dataset server-side.
 */
export function AirportCombobox({
  label,
  value,
  onChange,
  placeholder = "City, airport or ICAO",
  runwayConstraintM,
}: {
  label: string;
  value: Airport | null;
  onChange: (a: Airport) => void;
  placeholder?: string;
  runwayConstraintM?: number;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [results, setResults] = useState<Airport[]>([]);
  const [loading, setLoading] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = `airports-${label.replace(/\s+/g, "-").toLowerCase()}`;

  // Debounced server search. Each run aborts the one before it, so a fast
  // typist can't have an earlier response overwrite a later one.
  useEffect(() => {
    if (!open) return;
    const controller = new AbortController();
    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/airports?q=${encodeURIComponent(query)}`, {
          signal: controller.signal,
        });
        const data = await res.json();
        setResults(data.airports ?? []);
      } catch {
        // An abort is the normal path when typing continues; leave the list be.
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, query ? 140 : 0);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, open]);

  useEffect(() => setActive(0), [query, open]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const select = (a: Airport) => {
    onChange(a);
    setQuery("");
    setOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((i) => Math.min(results.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter" && open && results[active]) {
      e.preventDefault();
      select(results[active]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const display = value ? `${value.iata !== "—" ? value.iata + " · " : ""}${value.name}` : query;

  return (
    <div ref={rootRef} className="relative flex flex-col gap-2">
      <label className="type-label text-ink-600">{label}</label>
      <div className="relative">
        <input
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          value={open ? query : display}
          placeholder={placeholder}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          className="h-13 w-full rounded-control border border-line-300 bg-paper pl-4 pr-10 type-body text-ink-700 placeholder:text-ink-200 transition-colors duration-120 hover:border-ink-400 focus-visible:border-cyan-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
        />
        <Plane size={20} strokeWidth={1.5} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rotate-45 text-ink-400" aria-hidden />
      </div>

      {open && (
        <div
          id={listId}
          role="listbox"
          className="absolute top-full z-30 mt-2 max-h-80 w-full overflow-auto rounded-card border border-line-200 bg-paper shadow-float"
        >
          <p className="sticky top-0 bg-haze-050 px-4 py-2 type-label text-ink-400">
            {query ? "All results" : "Suggested"}
          </p>
          {results.length === 0 && (
            <p className="px-4 py-6 text-center type-body-sm text-ink-400">
              {loading
                ? "Searching…"
                : query
                  ? `No airport matches “${query}”. Try an ICAO code or a nearby city.`
                  : "Start typing a city, airport or code."}
            </p>
          )}
          {results.map((a, i) => (
            <button
              key={a.icao}
              type="button"
              role="option"
              aria-selected={i === active}
              onMouseEnter={() => setActive(i)}
              onClick={() => select(a)}
              className={cn(
                "flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors duration-120",
                i === active ? "bg-cyan-050" : "hover:bg-haze-050",
              )}
            >
              <span className="w-14 shrink-0 type-data-lg text-ink-700">
                {a.iata !== "—" ? a.iata : a.icao}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate type-body text-ink-700">{a.name}</span>
                <span className="block truncate type-body-sm text-ink-400">
                  {a.city}, {a.country}
                  {a.kind === "ga" && " · GA field"}
                </span>
              </span>
              <span className="shrink-0 text-right">
                {runwayConstraintM ? (
                  <span
                    className={cn(
                      "block type-data-sm",
                      a.runwayM >= runwayConstraintM ? "text-ink-400" : "text-stop-600",
                    )}
                  >
                    {formatKm(a.runwayM / 1000).replace(" km", "")}m rwy
                  </span>
                ) : (
                  <span className="block type-data-sm text-ink-400">{a.icao}</span>
                )}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
