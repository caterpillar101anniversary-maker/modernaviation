"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Check, Copy, Plus, Trash2, CircleCheck } from "lucide-react";
import { Button } from "@/components/primitives/Button";
import { Field, Input, TextField } from "@/components/primitives/Field";
import { Switch, Chip, RadioCard, SegmentedControl } from "@/components/primitives/Controls";
import { RouteDisplay } from "@/components/aviation/RouteDisplay";
import { CancellationPolicy } from "@/components/aviation/CancellationPolicy";
import { cn } from "@/lib/cn";
import { formatUsd } from "@/lib/format";
import type { Quote } from "@/lib/data";
import { createBooking, type BookingPayload } from "@/app/actions/booking";

type Unit = "kg" | "lb";
type PayMethod = "bank" | "card" | "paypal" | "account";

interface Pax {
  name: string;
  dob: string;
  nationality: string;
  passport: string;
  passportExpiry: string;
  weight: string;
  unit: Unit;
  save: boolean;
}

const emptyPax = (): Pax => ({
  name: "",
  dob: "",
  nationality: "United States",
  passport: "",
  passportExpiry: "",
  weight: "",
  unit: "kg",
  save: false,
});

const DIETARY = ["Halal", "Vegetarian", "Vegan", "Nut allergy", "Gluten-free"];
const FBOS: Record<string, string[]> = {
  CLT: ["Wilson Air Center", "Signature Flight Support CLT"],
  TEB: ["Signature Flight Support TEB", "Jet Aviation TEB"],
};

export function BookingClose({
  quote,
  international,
  user,
}: {
  quote: Quote;
  international: boolean;
  user: { firstName: string; lastName: string; email: string };
}) {
  const [pax, setPax] = useState<Pax[]>(() => {
    const arr = Array.from({ length: Math.min(2, quote.seats) }, emptyPax);
    arr[0].name = `${user.firstName} ${user.lastName}`;
    return arr;
  });
  const [fboFrom, setFboFrom] = useState(FBOS[quote.from.iata]?.[0] ?? "");
  const [fboTo, setFboTo] = useState(FBOS[quote.to.iata]?.[0] ?? "");
  const [groundTransport, setGroundTransport] = useState(false);
  const [dietary, setDietary] = useState<string[]>([]);
  const [catering, setCatering] = useState("");
  const [assistance, setAssistance] = useState("");
  const [method, setMethod] = useState<PayMethod>("bank");
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [ack, setAck] = useState(false);
  const [signature, setSignature] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [reference, setReference] = useState("");
  const [tripId, setTripId] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const setP = (i: number, patch: Partial<Pax>) =>
    setPax((p) => p.map((x, idx) => (idx === i ? { ...x, ...patch } : x)));

  const totalWeightKg = useMemo(
    () =>
      pax.reduce((sum, p) => {
        const w = parseFloat(p.weight) || 0;
        return sum + (p.unit === "lb" ? w * 0.4536 : w);
      }, 0),
    [pax],
  );
  const withinLimits = totalWeightKg <= quote.seats * 95; // rough demo envelope

  const discount = couponApplied ? Math.round(quote.totalUsd * 0.05) : 0;
  const amountDue = quote.totalUsd - discount;

  const copy = (label: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 1500);
  };

  const toKg = (p: Pax) => {
    const w = parseFloat(p.weight) || 0;
    return Math.round(p.unit === "lb" ? w * 0.4536 : w);
  };

  const submit = async () => {
    if (!signature.trim()) return setError("Type your full name to sign the charter agreement.");
    if (pax.some((p) => !p.name.trim() || !p.weight.trim()))
      return setError("Every passenger needs a full legal name and a weight for weight and balance.");
    if (!ack) return setError("You must acknowledge the cancellation policy before paying.");
    setError(null);
    setSubmitting(true);

    const payload: BookingPayload = {
      quoteId: quote.id,
      from: { iata: quote.from.iata, icao: quote.from.icao, name: quote.from.name, time: quote.from.time },
      to: { iata: quote.to.iata, icao: quote.to.icao, name: quote.to.name, time: quote.to.time },
      tz: quote.from.tz,
      dateLabel: quote.dateLabel ?? "Fri 14 Aug 2026",
      durationMin: quote.durationMinutes,
      aircraftModel: quote.aircraftModel,
      registration: quote.registration,
      operator: quote.operator,
      totalUsd: amountDue,
      paymentMethod: method,
      fboFrom,
      fboTo,
      passengers: pax.map((p) => ({ name: p.name, nationality: p.nationality, weightKg: toKg(p) })),
    };

    const result = await createBooking(payload);
    setSubmitting(false);
    if (!result.ok) return setError(result.error);
    setReference(result.reference);
    setTripId(result.id);
    setConfirmed(true);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (confirmed) {
    return (
      <div className="mx-auto max-w-160 px-5 py-16 text-center sm:px-6 lg:px-10">
        <CircleCheck size={48} strokeWidth={1.5} className="mx-auto text-ok-600" />
        <h1 className="mt-4 type-h1 text-ink-700">Booking confirmed</h1>
        <p className="mt-3 type-body text-ink-600">
          {method === "bank"
            ? "We've reserved the aircraft. It is released to your flight as soon as the transfer clears — usually within a few hours on business days."
            : "Payment received. Your aircraft is confirmed and on your trips."}
        </p>
        <div className="mt-6 inline-flex items-center gap-2 rounded-card border border-line-200 bg-paper px-4 py-3">
          <span className="type-label text-ink-400">Confirmation</span>
          <span className="type-data-lg text-ink-700">{reference}</span>
        </div>
        <div className="mt-8 flex justify-center gap-3">
          <Button asChild>
            <Link href={`/trips/${tripId}`}>View itinerary</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/trips">All my trips</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-320 gap-12 px-5 py-12 sm:px-6 lg:grid-cols-[1.4fr_1fr] lg:px-10">
      <div className="flex flex-col gap-12">
        {error && (
          <div className="rounded-card border border-stop-600 bg-stop-050 px-4 py-3" role="alert">
            <p className="type-body-sm text-stop-600">{error}</p>
          </div>
        )}

        {/* ── Stage 3 · Passenger manifest ── */}
        <section id="manifest">
          <h2 className="type-h2 text-ink-700">Passenger manifest</h2>
          <p className="mt-2 type-body text-ink-600">
            Weights are required for weight and balance. Small aircraft are certified to strict limits —
            this is a safety calculation, not a personal one.
          </p>
          <div className="mt-6 flex flex-col gap-5">
            {pax.map((p, i) => (
              <div key={i} className="rounded-card border border-line-200 bg-paper p-5">
                <div className="mb-4 flex items-center justify-between">
                  <span className="type-label text-ink-400">
                    Passenger {String(i + 1).padStart(2, "0")}
                    {i === 0 && " · lead"}
                  </span>
                  {i > 0 && (
                    <button
                      type="button"
                      onClick={() => setPax((prev) => prev.filter((_, idx) => idx !== i))}
                      className="inline-flex items-center gap-1 type-body-sm text-ink-400 hover:text-stop-600"
                    >
                      <Trash2 size={16} strokeWidth={1.5} /> Remove
                    </button>
                  )}
                </div>
                <div className="flex flex-col gap-5">
                  <TextField
                    label="Full legal name"
                    helper="Exactly as printed on the ID you'll travel with."
                    value={p.name}
                    onChange={(e) => setP(i, { name: e.target.value })}
                  />
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Date of birth" htmlFor={`dob-${i}`}>
                      <Input id={`dob-${i}`} type="date" value={p.dob} onChange={(e) => setP(i, { dob: e.target.value })} />
                    </Field>
                    <TextField label="Nationality" value={p.nationality} onChange={(e) => setP(i, { nationality: e.target.value })} />
                  </div>
                  {international && (
                    <div className="grid gap-5 sm:grid-cols-2">
                      <TextField label="Passport number" value={p.passport} onChange={(e) => setP(i, { passport: e.target.value })} />
                      <Field label="Passport expiry" htmlFor={`pex-${i}`}>
                        <Input id={`pex-${i}`} type="date" value={p.passportExpiry} onChange={(e) => setP(i, { passportExpiry: e.target.value })} />
                      </Field>
                    </div>
                  )}
                  <div className="flex items-end gap-3">
                    <TextField
                      label="Weight"
                      inputMode="decimal"
                      className="flex-1"
                      helper="Required for weight and balance."
                      value={p.weight}
                      onChange={(e) => setP(i, { weight: e.target.value })}
                    />
                    <div className="w-28 pb-6">
                      <SegmentedControl
                        options={[{ value: "kg", label: "kg" }, { value: "lb", label: "lb" }]}
                        value={p.unit}
                        onChange={(u) => setP(i, { unit: u })}
                      />
                    </div>
                  </div>
                  <label className="flex items-center gap-2 type-body-sm text-ink-600">
                    <input
                      type="checkbox"
                      className="h-4 w-4 accent-cyan-600"
                      checked={p.save}
                      onChange={(e) => setP(i, { save: e.target.checked })}
                    />
                    Save to my travellers for future bookings
                  </label>
                </div>
              </div>
            ))}
            {pax.length < quote.seats && (
              <Button variant="ghost" onClick={() => setPax((p) => [...p, emptyPax()])}>
                <Plus size={20} strokeWidth={1.5} /> Add passenger
              </Button>
            )}
          </div>

          {/* Live aggregate strip (§12.5) */}
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 rounded-card bg-haze-050 px-4 py-3">
            <span className="type-data-sm text-ink-600">{pax.length} passengers</span>
            <span className="type-data-sm text-ink-600">· {Math.round(totalWeightKg)} kg</span>
            <span className={cn("type-data-sm", withinLimits ? "text-ok-600" : "text-stop-600")}>
              · {withinLimits ? "within limits" : "over envelope — reduce load or upsize"}
            </span>
          </div>
        </section>

        {/* ── Stage 4 · Ground & service ── */}
        <section>
          <h2 className="type-h2 text-ink-700">Ground &amp; service</h2>
          <div className="mt-6 flex flex-col gap-6">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label={`FBO at ${quote.from.iata}`} htmlFor="fbo-from">
                <select
                  id="fbo-from"
                  value={fboFrom}
                  onChange={(e) => setFboFrom(e.target.value)}
                  className="h-13 w-full rounded-control border border-line-300 bg-paper px-4 type-body text-ink-700 focus-visible:border-cyan-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
                >
                  {(FBOS[quote.from.iata] ?? ["Main GA terminal"]).map((f) => <option key={f}>{f}</option>)}
                </select>
              </Field>
              <Field label={`FBO at ${quote.to.iata}`} htmlFor="fbo-to">
                <select
                  id="fbo-to"
                  value={fboTo}
                  onChange={(e) => setFboTo(e.target.value)}
                  className="h-13 w-full rounded-control border border-line-300 bg-paper px-4 type-body text-ink-700 focus-visible:border-cyan-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
                >
                  {(FBOS[quote.to.iata] ?? ["Main GA terminal"]).map((f) => <option key={f}>{f}</option>)}
                </select>
              </Field>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="type-label text-ink-600">Ground transport to and from the aircraft</p>
                <p className="mt-1 type-body-sm text-ink-400">A car meets you planeside at both ends.</p>
              </div>
              <Switch checked={groundTransport} onChange={setGroundTransport} ariaLabel="Ground transport" />
            </div>
            <div className="flex flex-col gap-2">
              <span className="type-label text-ink-600">Dietary requirements <span className="font-normal normal-case text-ink-400">(optional)</span></span>
              <div className="flex flex-wrap gap-2">
                {DIETARY.map((d) => (
                  <Chip key={d} selected={dietary.includes(d)} onClick={() => setDietary((s) => s.includes(d) ? s.filter((x) => x !== d) : [...s, d])}>{d}</Chip>
                ))}
              </div>
            </div>
            <Field label="Catering requests" optional htmlFor="catering">
              <textarea
                id="catering"
                value={catering}
                onChange={(e) => setCatering(e.target.value)}
                placeholder="e.g. hot breakfast for two, still and sparkling water, no shellfish"
                className="min-h-30 w-full rounded-control border border-line-300 bg-paper p-4 type-body text-ink-700 placeholder:text-ink-200 focus-visible:border-cyan-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
              />
            </Field>
            <TextField
              label="Mobility or medical assistance"
              optional
              placeholder="e.g. wheelchair to aircraft steps"
              value={assistance}
              onChange={(e) => setAssistance(e.target.value)}
            />
          </div>
        </section>

        {/* ── Stage 5 · Charter agreement + payment ── */}
        <section>
          <h2 className="type-h2 text-ink-700">Charter agreement</h2>
          <p className="mt-2 type-body text-ink-600">
            Sign by typing your full legal name. This is a demo signature; a real e-signature service
            replaces it before launch.
          </p>
          <div className="mt-4">
            <TextField label="Signature — type your full name" value={signature} onChange={(e) => setSignature(e.target.value)} />
          </div>
        </section>

        <section>
          <h2 className="type-h2 text-ink-700">Payment</h2>
          <p className="mt-2 type-body text-ink-600">
            Bank transfer is the recommended method — card limits often break on large charters.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <RadioCard
              selected={method === "bank"}
              onSelect={() => setMethod("bank")}
              title="Bank transfer / ACH"
              description="Recommended. Fastest processing for full-charter amounts."
            />
            <RadioCard selected={method === "account"} onSelect={() => setMethod("account")} title="Modern Aviation CLT account balance" description="Pay from your company jet-card balance — instant confirmation." />
            <RadioCard selected={method === "card"} onSelect={() => setMethod("card")} title="Card" description="Visa / Mastercard. Subject to your card's transaction limit." />
            <RadioCard selected={method === "paypal"} onSelect={() => setMethod("paypal")} title="PayPal" description="You'll be redirected to PayPal to authorise the payment." />
          </div>

          {/* Method-specific content */}
          <div className="mt-6">
            {method === "bank" && (
              <div className="rounded-card border border-line-200 bg-paper p-5">
                <p className="type-body-sm text-ink-400">Transfer the amount due to:</p>
                <dl className="mt-3 flex flex-col gap-2">
                  {[
                    ["Bank", "Truist Bank"],
                    ["Account name", "Modern Aviation CLT LLC"],
                    ["Routing (ACH)", "053101121"],
                    ["Account number", "1000012345678"],
                    ["Reference", reference],
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-center justify-between gap-4">
                      <dt className="type-body-sm text-ink-400">{label}</dt>
                      <dd className="flex items-center gap-2">
                        <span className={label === "Reference" ? "type-data-lg text-ink-700" : "type-data text-ink-700"}>{value}</span>
                        <button type="button" onClick={() => copy(label, value)} className="text-ink-400 hover:text-cyan-600" aria-label={`Copy ${label}`}>
                          {copied === label ? <Check size={16} strokeWidth={1.5} className="text-ok-600" /> : <Copy size={16} strokeWidth={1.5} />}
                        </button>
                      </dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-4 border-t border-line-200 pt-4 type-body-sm text-ink-400">
                  The aircraft is released to your flight once the transfer clears — usually within a few hours on business days. Always include the reference.
                </p>
              </div>
            )}
            {method === "card" && (
              <div className="grid gap-5 rounded-card border border-line-200 bg-paper p-5 sm:grid-cols-2">
                <TextField label="Card number" placeholder="4242 4242 4242 4242" className="sm:col-span-2" />
                <TextField label="Expiry" placeholder="MM/YY" />
                <TextField label="CVC" placeholder="123" />
              </div>
            )}
            {method === "paypal" && (
              <div className="rounded-card border border-line-200 bg-paper p-5 type-body-sm text-ink-600">
                You&apos;ll be redirected to PayPal to authorise {formatUsd(amountDue)}. This is a demo — no real charge is made.
              </div>
            )}
            {method === "account" && (
              <div className="rounded-card border border-line-200 bg-paper p-5">
                <div className="flex items-center justify-between">
                  <span className="type-body-sm text-ink-400">Available balance</span>
                  <span className="type-data-lg text-ink-700">{formatUsd(1250000)}</span>
                </div>
                <p className="mt-3 type-body-sm text-ink-400">Paying from balance confirms the aircraft instantly.</p>
              </div>
            )}
          </div>

          {/* Coupon */}
          <div className="mt-6 flex items-end gap-3">
            <TextField label="Coupon code" optional placeholder="e.g. RETURN5" className="flex-1" value={coupon} onChange={(e) => { setCoupon(e.target.value); setCouponApplied(false); }} />
            <div className="pb-6">
              <Button variant="secondary" onClick={() => setCouponApplied(coupon.trim().length > 0)}>Apply</Button>
            </div>
          </div>
          {couponApplied && <p className="mt-1 type-body-sm text-ok-600">Coupon applied — 5% off this booking.</p>}

          {/* Cancellation acknowledgment — required, never pre-checked (§12.7) */}
          <div className="mt-8">
            <h3 className="type-h3 text-ink-700">Cancellation policy</h3>
            <div className="mt-3">
              <CancellationPolicy />
            </div>
            <label className="mt-4 flex items-start gap-3 rounded-card border border-line-200 bg-paper p-4">
              <input type="checkbox" className="mt-1 h-4 w-4 accent-cyan-600" checked={ack} onChange={(e) => setAck(e.target.checked)} />
              <span className="type-body-sm text-ink-700">
                I have read and accept the cancellation policy above, including that a cancellation
                under 24 hours before departure is charged at 100% of the charter price.
              </span>
            </label>
          </div>
        </section>
      </div>

      {/* Sticky summary / amount due (§12.7 — amount due on a dark panel) */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="flex flex-col gap-4">
          <div className="rounded-card border border-line-200 bg-paper p-5">
            <p className="type-label text-ink-400">Your flight</p>
            <div className="mt-3">
              <RouteDisplay from={quote.from} to={quote.to} durationMinutes={quote.durationMinutes} />
            </div>
            <p className="mt-3 type-data-sm text-ink-400">{quote.aircraftModel} · {quote.registration} · {quote.operator}</p>
          </div>

          <div className="rounded-card bg-ink-000 p-6">
            <p className="type-label text-ink-ondark">Amount due</p>
            <p className="mt-2 type-data-xl text-paper">{formatUsd(amountDue)}</p>
            <p className="mt-1 type-data-sm text-ink-ondark">USD</p>
            {discount > 0 && <p className="mt-2 type-data-sm text-ok-600">Coupon −{formatUsd(discount)}</p>}
            <Button onClick={submit} variant="onDark" size="lg" className="mt-5 w-full" disabled={submitting}>
              {submitting ? "Confirming…" : method === "bank" ? "Confirm booking" : "Confirm and pay"}
            </Button>
            <p className="mt-3 type-body-sm text-ink-ondark">
              You&apos;ll receive a confirmation with the itinerary and receipt.
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}
