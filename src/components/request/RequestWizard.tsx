"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Plane, Plus, Trash2, Check } from "lucide-react";
import { Wordmark } from "@/components/layout/Wordmark";
import { Button } from "@/components/primitives/Button";
import { SegmentedControl, Stepper, Chip, Switch } from "@/components/primitives/Controls";
import { TextField, Field, Input } from "@/components/primitives/Field";
import { AirportCombobox } from "@/components/aviation/AirportCombobox";
import { RouteDisplay } from "@/components/aviation/RouteDisplay";
import { WizardProgress } from "@/components/request/WizardProgress";
import { categories, findAirport, type Airport } from "@/lib/data";
import { lookupUserByEmail } from "@/app/actions/auth";
import { formatUsd } from "@/lib/format";
import { cn } from "@/lib/cn";

type TripType = "one-way" | "return" | "multi-leg";
type Flex = "exact" | "2h" | "1d";

interface Leg {
  from: Airport | null;
  to: Airport | null;
  date: string;
  time: string;
}

interface State {
  tripType: TripType;
  from: Airport | null;
  to: Airport | null;
  date: string;
  time: string;
  flexibility: Flex;
  returnDate: string;
  returnTime: string;
  legs: Leg[];
  passengers: number;
  baggagePieces: number;
  oversized: string[];
  pets: boolean;
  petInfo: string;
  categories: string[];
  amenities: string[];
  noPreference: boolean;
  name: string;
  email: string;
  phone: string;
  company: string;
}

const initial: State = {
  tripType: "one-way",
  from: null,
  to: null,
  date: "",
  time: "",
  flexibility: "2h",
  returnDate: "",
  returnTime: "",
  legs: [{ from: null, to: null, date: "", time: "" }],
  passengers: 2,
  baggagePieces: 2,
  oversized: [],
  pets: false,
  petInfo: "",
  categories: [],
  amenities: [],
  noPreference: true,
  name: "",
  email: "",
  phone: "",
  company: "",
};

const STORAGE_KEY = "meridian-request";
const OVERSIZED = ["Golf clubs", "Skis", "Instrument case", "Wheelchair", "Pet crate"];
const AMENITIES = ["Enclosed lavatory", "Wi-Fi", "Standing cabin", "Flat bed"];

function fitsText(pax: number): string {
  if (pax <= 4) return "Fits: very light jet and above";
  if (pax <= 6) return "Fits: light jet and above";
  if (pax <= 8) return "Fits: midsize and above";
  if (pax <= 10) return "Fits: super midsize and above";
  return "Fits: heavy and ultra-long-range";
}

function serialize(s: State) {
  return JSON.stringify({
    ...s,
    from: s.from?.icao ?? null,
    to: s.to?.icao ?? null,
    legs: s.legs.map((l) => ({ ...l, from: l.from?.icao ?? null, to: l.to?.icao ?? null })),
  });
}
function hydrate(raw: string): State | null {
  try {
    const o = JSON.parse(raw);
    return {
      ...initial,
      ...o,
      from: o.from ? findAirport(o.from) ?? null : null,
      to: o.to ? findAirport(o.to) ?? null : null,
      legs: (o.legs ?? initial.legs).map((l: Leg & { from: string | null; to: string | null }) => ({
        ...l,
        from: l.from ? findAirport(l.from as unknown as string) ?? null : null,
        to: l.to ? findAirport(l.to as unknown as string) ?? null : null,
      })),
    };
  } catch {
    return null;
  }
}

export function RequestWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [state, setState] = useState<State>(initial);
  const [restored, setRestored] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const topRef = useRef<HTMLDivElement>(null);

  // Restore on mount.
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const h = hydrate(raw);
      if (h) {
        setState(h);
        setRestored(true);
      }
    }
  }, []);

  // Persist on change (§13.2 persistence).
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, serialize(state));
  }, [state]);

  const set = <K extends keyof State>(key: K, value: State[K]) => setState((s) => ({ ...s, [key]: value }));
  const toggle = (key: "oversized" | "amenities", value: string) =>
    setState((s) => ({
      ...s,
      [key]: s[key].includes(value) ? s[key].filter((v) => v !== value) : [...s[key], value],
    }));

  const validateStep = (): string | null => {
    if (step === 0) {
      if (state.tripType === "multi-leg") {
        if (state.legs.some((l) => !l.from || !l.to)) return "Add an origin and destination for every leg.";
      } else if (!state.from || !state.to) {
        return "Choose both an origin and a destination airport.";
      }
    }
    if (step === 2) {
      if (!state.name.trim()) return "Enter the name we should put on the quote.";
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(state.email)) return "Enter a valid email so we can send the quote.";
    }
    return null;
  };

  const next = () => {
    const err = validateStep();
    if (err) {
      setError(err);
      topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    setError(null);
    if (step < 3) {
      setStep(step + 1);
      topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      localStorage.removeItem(STORAGE_KEY);
      router.push("/quotes");
    }
  };
  const back = () => {
    setError(null);
    if (step > 0) setStep(step - 1);
  };

  const onEmailBlur = async () => {
    // Autofill from a returning user's real account (Postgres via server action).
    const u = await lookupUserByEmail(state.email);
    if (u) {
      setState((s) => ({ ...s, name: s.name || `${u.firstName} ${u.lastName}` }));
    }
  };

  const startOver = () => {
    localStorage.removeItem(STORAGE_KEY);
    setState(initial);
    setStep(0);
    setRestored(false);
  };

  return (
    <div className="flex min-h-dvh flex-col bg-haze-100">
      {/* Minimal top bar — §13.2 */}
      <header className="sticky top-0 z-40 border-b border-line-200 bg-paper">
        <div className="mx-auto flex h-14 max-w-256 items-center justify-between px-5 sm:px-6 lg:h-18 lg:px-10">
          <Link href="/" aria-label="Modern Aviation CLT home" className="rounded-control">
            <Wordmark />
          </Link>
          <Button asChild variant="ghost" size="sm">
            <Link href="/">Save and exit</Link>
          </Button>
        </div>
      </header>

      {/* Progress */}
      <div className="border-b border-line-200 bg-paper">
        <div className="mx-auto max-w-160 px-5 py-6 sm:px-6 lg:px-10">
          <WizardProgress current={step} />
        </div>
      </div>

      <div ref={topRef} className="mx-auto w-full max-w-160 flex-1 px-5 py-9 sm:px-6 lg:px-10">
        {restored && step === 0 && (
          <div className="mb-6 flex items-center justify-between gap-4 rounded-card bg-haze-050 px-4 py-3">
            <p className="type-body-sm text-ink-600">Picked up where you left off.</p>
            <Button variant="ghost" size="sm" onClick={startOver}>Start over</Button>
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-card border border-stop-600 bg-stop-050 px-4 py-3" role="alert">
            <p className="type-body-sm text-stop-600">{error}</p>
          </div>
        )}

        {step === 0 && <StepRoute state={state} set={set} toggle={toggle} />}
        {step === 1 && <StepAircraft state={state} set={set} toggle={toggle} />}
        {step === 2 && <StepContact state={state} set={set} onEmailBlur={onEmailBlur} />}
        {step === 3 && <StepReview state={state} goto={setStep} />}
      </div>

      {/* Sticky footer bar — §13.2 */}
      <div className="sticky bottom-0 z-40 border-t border-line-200 bg-paper shadow-float">
        <div className="mx-auto flex h-18 max-w-160 items-center justify-between px-5 sm:px-6 lg:px-10">
          {step > 0 ? (
            <Button variant="ghost" onClick={back}>
              <ArrowLeft size={20} strokeWidth={1.5} />
              <span className="hidden sm:inline">Back</span>
            </Button>
          ) : (
            <span />
          )}
          <span className="type-data-sm text-ink-400">Step {step + 1} of 4</span>
          <Button onClick={next} className="max-sm:flex-1">
            {step === 3 ? "Request quotes" : "Continue"}
            <ArrowRight size={20} strokeWidth={1.5} />
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ── Step 1 · Route ── */
function StepRoute({
  state,
  set,
  toggle,
}: {
  state: State;
  set: <K extends keyof State>(k: K, v: State[K]) => void;
  toggle: (k: "oversized" | "amenities", v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="type-h1 text-ink-700">Where are you flying?</h1>
        <p className="mt-2 type-body text-ink-400">No account needed — we only ask what shapes the quote.</p>
      </div>

      <SegmentedControl
        options={[
          { value: "one-way", label: "One way" },
          { value: "return", label: "Return" },
          { value: "multi-leg", label: "Multi-leg" },
        ]}
        value={state.tripType}
        onChange={(v) => set("tripType", v)}
      />

      {state.tripType !== "multi-leg" ? (
        <div className="flex flex-col gap-5">
          <div className="grid gap-5 md:grid-cols-2">
            <AirportCombobox label="From" value={state.from} onChange={(a) => set("from", a)} />
            <AirportCombobox label="To" value={state.to} onChange={(a) => set("to", a)} />
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Departure date" htmlFor="date">
              <Input id="date" type="date" value={state.date} onChange={(e) => set("date", e.target.value)} />
            </Field>
            <Field label="Departure time" htmlFor="time" helper="Departure airport local time.">
              <Input id="time" type="time" value={state.time} onChange={(e) => set("time", e.target.value)} />
            </Field>
          </div>
          {state.tripType === "return" && (
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Return date" htmlFor="rdate">
                <Input id="rdate" type="date" value={state.returnDate} onChange={(e) => set("returnDate", e.target.value)} />
              </Field>
              <Field label="Return time" htmlFor="rtime">
                <Input id="rtime" type="time" value={state.returnTime} onChange={(e) => set("returnTime", e.target.value)} />
              </Field>
            </div>
          )}
          <Field label="Time flexibility" helper="Flexible times often reduce the quote.">
            <SegmentedControl
              options={[
                { value: "exact", label: "Exact" },
                { value: "2h", label: "±2h" },
                { value: "1d", label: "±1 day" },
              ]}
              value={state.flexibility}
              onChange={(v) => set("flexibility", v)}
            />
          </Field>
        </div>
      ) : (
        <MultiLeg legs={state.legs} onChange={(legs) => set("legs", legs)} />
      )}

      {/* Passengers */}
      <Field label="Passengers" helper={fitsText(state.passengers)}>
        <Stepper value={state.passengers} onChange={(v) => set("passengers", v)} min={1} max={19} ariaLabel="Passenger count" />
      </Field>

      {/* Baggage */}
      <div className="flex flex-col gap-4">
        <Field label="Baggage pieces">
          <Stepper value={state.baggagePieces} onChange={(v) => set("baggagePieces", v)} min={0} max={40} ariaLabel="Baggage pieces" />
        </Field>
        <div className="flex flex-col gap-2">
          <span className="type-label text-ink-600">Oversized items <span className="font-normal normal-case text-ink-400">(optional)</span></span>
          <div className="flex flex-wrap gap-2">
            {OVERSIZED.map((item) => (
              <Chip key={item} selected={state.oversized.includes(item)} onClick={() => toggle("oversized", item)}>
                {item}
              </Chip>
            ))}
          </div>
          {state.oversized.includes("Golf clubs") && (
            <p className="type-body-sm text-warn-600">
              Golf bags won&apos;t fit a light jet hold. Midsize or larger recommended.
            </p>
          )}
        </div>
      </div>

      {/* Pets */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="type-label text-ink-600">Travelling with a pet?</p>
            <p className="mt-1 type-body-sm text-ink-400">Some operators restrict pets. We&apos;ll only quote operators that accept them.</p>
          </div>
          <Switch checked={state.pets} onChange={(v) => set("pets", v)} ariaLabel="Travelling with a pet" />
        </div>
        {state.pets && (
          <Input
            placeholder="Species and weight, e.g. Labrador, 28 kg"
            value={state.petInfo}
            onChange={(e) => set("petInfo", e.target.value)}
          />
        )}
      </div>
    </div>
  );
}

function MultiLeg({ legs, onChange }: { legs: Leg[]; onChange: (l: Leg[]) => void }) {
  const update = (i: number, patch: Partial<Leg>) =>
    onChange(legs.map((l, idx) => (idx === i ? { ...l, ...patch } : l)));
  return (
    <div className="flex flex-col gap-6">
      {legs.map((leg, i) => (
        <div key={i} className="rounded-card border border-line-200 bg-paper p-5">
          <div className="mb-4 flex items-center justify-between">
            <span className="type-label text-ink-400">Leg {String(i + 1).padStart(2, "0")}</span>
            {legs.length > 1 && (
              <button
                type="button"
                onClick={() => onChange(legs.filter((_, idx) => idx !== i))}
                className="inline-flex items-center gap-1 rounded-control type-body-sm text-ink-400 hover:text-stop-600"
              >
                <Trash2 size={16} strokeWidth={1.5} /> Remove
              </button>
            )}
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <AirportCombobox label="From" value={leg.from} onChange={(a) => update(i, { from: a })} />
            <AirportCombobox label="To" value={leg.to} onChange={(a) => update(i, { to: a })} />
            <Field label="Date" htmlFor={`leg-date-${i}`}>
              <Input id={`leg-date-${i}`} type="date" value={leg.date} onChange={(e) => update(i, { date: e.target.value })} />
            </Field>
            <Field label="Time" htmlFor={`leg-time-${i}`}>
              <Input id={`leg-time-${i}`} type="time" value={leg.time} onChange={(e) => update(i, { time: e.target.value })} />
            </Field>
          </div>
        </div>
      ))}
      <div>
        <Button variant="ghost" onClick={() => onChange([...legs, { from: null, to: null, date: "", time: "" }])}>
          <Plus size={20} strokeWidth={1.5} /> Add leg
        </Button>
      </div>
    </div>
  );
}

/* ── Step 2 · Aircraft ── */
function StepAircraft({
  state,
  set,
  toggle,
}: {
  state: State;
  set: <K extends keyof State>(k: K, v: State[K]) => void;
  toggle: (k: "oversized" | "amenities", v: string) => void;
}) {
  const toggleCategory = (slug: string) => {
    const has = state.categories.includes(slug);
    const nextCats = has ? state.categories.filter((c) => c !== slug) : [...state.categories, slug];
    set("categories", nextCats);
    set("noPreference", nextCats.length === 0);
  };
  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="type-h1 text-ink-700">Any aircraft preference?</h1>
        <p className="mt-2 type-body text-ink-400">Optional. Leave it on “no preference” and we&apos;ll quote the best fit for {state.passengers} passengers.</p>
      </div>

      <button
        type="button"
        onClick={() => {
          set("noPreference", true);
          set("categories", []);
        }}
        className={cn(
          "flex items-center gap-3 rounded-card border bg-paper p-4 text-left transition-colors duration-120",
          state.noPreference ? "border-cyan-600 bg-cyan-050" : "border-line-200 hover:border-line-300",
        )}
      >
        <span className={cn("grid h-5 w-5 place-items-center rounded-pill border-2", state.noPreference ? "border-cyan-600" : "border-line-300")}>
          {state.noPreference && <Check size={14} strokeWidth={2} className="text-cyan-600" />}
        </span>
        <span className="type-h3 text-ink-700">No preference — show me everything</span>
      </button>

      <div className="grid gap-4 sm:grid-cols-2">
        {categories.map((c) => {
          const selected = state.categories.includes(c.slug);
          return (
            <button
              key={c.slug}
              type="button"
              onClick={() => toggleCategory(c.slug)}
              className={cn(
                "flex flex-col gap-3 rounded-card border bg-paper p-5 text-left transition-colors duration-120",
                selected ? "border-cyan-600 bg-cyan-050" : "border-line-200 hover:border-line-300",
              )}
            >
              <div className="flex items-center justify-between">
                <Plane size={24} strokeWidth={1.5} className="-rotate-45 text-ink-400" aria-hidden />
                {selected && <Check size={20} strokeWidth={1.5} className="text-cyan-600" />}
              </div>
              <div>
                <p className="type-h3 text-ink-700">{c.name}</p>
                <p className="mt-1 type-data-sm text-ink-400">{c.typicalSeats} seats · {c.typicalRangeKm} km</p>
              </div>
              <p className="type-data text-ink-600">from {formatUsd(c.indicativeHourlyUsd)} <span className="type-body-sm text-ink-400">/ hr</span></p>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-2">
        <span className="type-label text-ink-600">Must-have amenities <span className="font-normal normal-case text-ink-400">(optional)</span></span>
        <div className="flex flex-wrap gap-2">
          {AMENITIES.map((a) => (
            <Chip key={a} selected={state.amenities.includes(a)} onClick={() => toggle("amenities", a)}>{a}</Chip>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Step 3 · Contact ── */
function StepContact({
  state,
  set,
  onEmailBlur,
}: {
  state: State;
  set: <K extends keyof State>(k: K, v: State[K]) => void;
  onEmailBlur: () => void;
}) {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="type-h1 text-ink-700">Where do we send the quote?</h1>
        <p className="mt-2 type-body text-ink-400">We don&apos;t collect passport details until a price exists.</p>
      </div>

      <TextField
        label="Email"
        type="email"
        placeholder="you@company.com"
        value={state.email}
        onChange={(e) => set("email", e.target.value)}
        onBlur={onEmailBlur}
        helper="Enter your email first — returning clients have the rest filled in automatically."
      />
      <TextField label="Full name" placeholder="First and last name" value={state.name} onChange={(e) => set("name", e.target.value)} />
      <div className="grid gap-5 md:grid-cols-2">
        <TextField label="Phone" placeholder="+1 …" value={state.phone} onChange={(e) => set("phone", e.target.value)} />
        <TextField label="Company" optional value={state.company} onChange={(e) => set("company", e.target.value)} />
      </div>
    </div>
  );
}

/* ── Step 4 · Review ── */
function StepReview({ state, goto }: { state: State; goto: (n: number) => void }) {
  const legs =
    state.tripType === "multi-leg"
      ? state.legs
      : [{ from: state.from, to: state.to, date: state.date, time: state.time }];

  const EditLink = ({ to }: { to: number }) => (
    <button type="button" onClick={() => goto(to)} className="rounded-control type-body-sm font-semibold text-cyan-600 hover:text-cyan-500">
      Edit
    </button>
  );

  const Row = ({ label, value }: { label: string; value: string }) => (
    <div className="flex items-center justify-between gap-4 border-b border-line-200 py-3 last:border-0">
      <dt className="type-body-sm text-ink-400">{label}</dt>
      <dd className="type-body text-ink-700">{value}</dd>
    </div>
  );

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="type-h1 text-ink-700">Review your request</h1>
        <p className="mt-2 type-body text-ink-400">We&apos;ll contact vetted operators and return firm quotes — most within twenty minutes.</p>
      </div>

      <section className="rounded-card border border-line-200 bg-paper p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="type-h3 text-ink-700">Route</h2>
          <EditLink to={0} />
        </div>
        <div className="flex flex-col gap-5">
          {legs.map((leg, i) =>
            leg.from && leg.to ? (
              <RouteDisplay
                key={i}
                from={{ iata: leg.from.iata !== "—" ? leg.from.iata : leg.from.icao, icao: leg.from.icao, name: leg.from.name }}
                to={{ iata: leg.to.iata !== "—" ? leg.to.iata : leg.to.icao, icao: leg.to.icao, name: leg.to.name }}
                durationMinutes={75}
              />
            ) : (
              <p key={i} className="type-body-sm text-ink-400">Leg {i + 1} incomplete</p>
            ),
          )}
        </div>
        <dl className="mt-4">
          <Row label="Trip type" value={state.tripType === "one-way" ? "One way" : state.tripType === "return" ? "Return" : "Multi-leg"} />
          <Row label="Departure" value={state.date ? `${state.date} ${state.time}`.trim() : "To confirm"} />
          <Row label="Flexibility" value={state.flexibility === "exact" ? "Exact" : state.flexibility === "2h" ? "±2 hours" : "±1 day"} />
          <Row label="Passengers" value={String(state.passengers)} />
          <Row label="Baggage" value={`${state.baggagePieces} pieces${state.oversized.length ? " · " + state.oversized.join(", ") : ""}`} />
          {state.pets && <Row label="Pet" value={state.petInfo || "Yes"} />}
        </dl>
      </section>

      <section className="rounded-card border border-line-200 bg-paper p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="type-h3 text-ink-700">Aircraft</h2>
          <EditLink to={1} />
        </div>
        <dl>
          <Row
            label="Category"
            value={state.noPreference ? "No preference" : state.categories.map((c) => categories.find((x) => x.slug === c)?.name).join(", ")}
          />
          <Row label="Amenities" value={state.amenities.length ? state.amenities.join(", ") : "None specified"} />
        </dl>
      </section>

      <section className="rounded-card border border-line-200 bg-paper p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="type-h3 text-ink-700">Contact</h2>
          <EditLink to={2} />
        </div>
        <dl>
          <Row label="Name" value={state.name || "—"} />
          <Row label="Email" value={state.email || "—"} />
          <Row label="Phone" value={state.phone || "—"} />
        </dl>
      </section>
    </div>
  );
}
