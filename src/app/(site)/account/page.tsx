"use client";

import { useState } from "react";
import { User, Users, CreditCard, Settings2, Plus } from "lucide-react";
import { PageMasthead } from "@/components/layout/PageMasthead";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/primitives/Button";
import { Badge } from "@/components/primitives/Badge";
import { cn } from "@/lib/cn";

type Panel = "profile" | "travellers" | "payment" | "preferences";

const nav: { key: Panel; label: string; icon: typeof User }[] = [
  { key: "profile", label: "Profile", icon: User },
  { key: "travellers", label: "Travellers", icon: Users },
  { key: "payment", label: "Payment", icon: CreditCard },
  { key: "preferences", label: "Preferences", icon: Settings2 },
];

const savedTravellers = [
  { name: "Katherine Ross", nationality: "United States", passportExpiry: "12 Nov 2030", soon: false },
  { name: "Daniel Cho", nationality: "United States", passportExpiry: "03 Dec 2026", soon: true },
  { name: "Marcus Bell", nationality: "United States", passportExpiry: "22 Sep 2029", soon: false },
];

function FieldList({ rows }: { rows: [string, string][] }) {
  return (
    <dl>
      {rows.map(([label, value], i) => (
        <div key={label} className={cn("flex items-center justify-between gap-4 py-3", i < rows.length - 1 && "border-b border-line-200")}>
          <dt className="type-body-sm text-ink-400">{label}</dt>
          <dd className="type-body text-ink-700">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-card border border-line-200 bg-paper p-6">
      <div className="flex items-center justify-between">
        <h2 className="type-h3 text-ink-700">{title}</h2>
        <Button variant="ghost" size="sm">Edit</Button>
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default function AccountPage() {
  const [panel, setPanel] = useState<Panel>("profile");

  return (
    <>
      <PageMasthead eyebrow="Account" title="Your account" description="Profile, saved travellers, payment methods, and travel preferences." />
      <Container className="py-10">
        <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
          {/* Left nav (desktop) / scroll tabs (mobile) */}
          <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:gap-1" aria-label="Account sections">
            {nav.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setPanel(key)}
                className={cn(
                  "flex items-center gap-2 rounded-control px-4 py-2.5 type-body font-medium transition-colors duration-120",
                  panel === key ? "bg-cyan-050 text-cyan-600" : "text-ink-600 hover:bg-haze-050",
                )}
              >
                <Icon size={20} strokeWidth={1.5} /> {label}
              </button>
            ))}
          </nav>

          <div className="flex flex-col gap-6">
            {panel === "profile" && (
              <Panel title="Profile">
                <FieldList rows={[["Name", "Katherine Ross"], ["Email", "katherine.ross@rossholdings.com"], ["Phone", "+1 704 555 0142"], ["Company", "Ross Holdings"]]} />
              </Panel>
            )}

            {panel === "travellers" && (
              <>
                <div className="flex items-center justify-between">
                  <p className="type-body-sm text-ink-400">Saved travellers skip manifest entry on future bookings.</p>
                  <Button size="sm"><Plus size={16} strokeWidth={1.5} />Add traveller</Button>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {savedTravellers.map((t) => (
                    <div key={t.name} className="rounded-card border border-line-200 bg-paper p-5">
                      <p className="type-h3 text-ink-700">{t.name}</p>
                      <p className="mt-1 type-body-sm text-ink-400">{t.nationality}</p>
                      <div className="mt-3 flex items-center justify-between border-t border-line-200 pt-3">
                        <span className="type-body-sm text-ink-400">Passport expiry</span>
                        {t.soon ? (
                          <Badge tone="pending">{t.passportExpiry}</Badge>
                        ) : (
                          <span className="type-data-sm text-ink-700">{t.passportExpiry}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {panel === "payment" && (
              <>
                <Panel title="Account balance">
                  <FieldList rows={[["Available balance", "$1,250,000"], ["Currency", "USD"], ["Top-up method", "Bank transfer / ACH"]]} />
                </Panel>
                <Panel title="Bank transfer (default)">
                  <FieldList rows={[["Bank", "Truist Bank"], ["Account", "•••• 5678"], ["Reference format", "MAC-####-ROUTE"]]} />
                </Panel>
                <Panel title="Card">
                  <FieldList rows={[["Card", "Visa •••• 4242"], ["Expiry", "08/28"]]} />
                </Panel>
              </>
            )}

            {panel === "preferences" && (
              <>
                <Panel title="Travel preferences">
                  <FieldList rows={[["Preferred FBO, Charlotte", "Wilson Air Center"], ["Catering default", "Hot breakfast, still water"], ["Seat preference", "Forward, aisle"]]} />
                </Panel>
                <Panel title="How we reach you">
                  <FieldList rows={[["Primary", "Call"], ["Quote alerts", "On"], ["Route alerts", "Charlotte ⇄ New York"]]} />
                </Panel>
              </>
            )}
          </div>
        </div>
      </Container>
    </>
  );
}
