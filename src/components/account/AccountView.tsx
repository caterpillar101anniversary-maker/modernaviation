"use client";

import { useState } from "react";
import Link from "next/link";
import { User, Users, CreditCard, Settings2, Plus, LogOut } from "lucide-react";
import { PageMasthead } from "@/components/layout/PageMasthead";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/primitives/Button";
import { EmptyState } from "@/components/primitives/EmptyState";
import { cn } from "@/lib/cn";
import { signOut } from "@/app/actions/auth";

type Panel = "profile" | "travellers" | "payment" | "preferences";

const nav: { key: Panel; label: string; icon: typeof User }[] = [
  { key: "profile", label: "Profile", icon: User },
  { key: "travellers", label: "Travellers", icon: Users },
  { key: "payment", label: "Payment", icon: CreditCard },
  { key: "preferences", label: "Preferences", icon: Settings2 },
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

export function AccountView({
  user,
}: {
  user: { firstName: string; lastName: string; email: string; memberSince: string };
}) {
  const [panel, setPanel] = useState<Panel>("profile");

  return (
    <>
      <PageMasthead
        eyebrow="Account"
        title={`Hi, ${user.firstName}`}
        description="Your profile, saved travellers, payment methods, and travel preferences."
      />
      <Container className="py-10">
        <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
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
            <form action={signOut} className="lg:mt-2">
              <button
                type="submit"
                className="flex w-full items-center gap-2 rounded-control px-4 py-2.5 type-body font-medium text-ink-400 transition-colors duration-120 hover:bg-haze-050 hover:text-stop-600"
              >
                <LogOut size={20} strokeWidth={1.5} /> Sign out
              </button>
            </form>
          </nav>

          <div className="flex flex-col gap-6">
            {panel === "profile" && (
              <section className="rounded-card border border-line-200 bg-paper p-6">
                <div className="flex items-center justify-between">
                  <h2 className="type-h3 text-ink-700">Profile</h2>
                  <Button variant="ghost" size="sm">Edit</Button>
                </div>
                <div className="mt-4">
                  <FieldList
                    rows={[
                      ["First name", user.firstName],
                      ["Last name", user.lastName],
                      ["Email", user.email],
                      ["Member since", user.memberSince],
                    ]}
                  />
                </div>
              </section>
            )}

            {panel === "travellers" && (
              <EmptyState
                icon={Users}
                title="No saved travellers yet"
                description="Add one now and skip manifest entry on every future booking."
                action={<Button><Plus size={20} strokeWidth={1.5} />Add traveller</Button>}
              />
            )}

            {panel === "payment" && (
              <EmptyState
                icon={CreditCard}
                title="No payment methods yet"
                description="Add a bank transfer, account balance, or card to check out faster."
                action={<Button><Plus size={20} strokeWidth={1.5} />Add payment method</Button>}
              />
            )}

            {panel === "preferences" && (
              <EmptyState
                icon={Settings2}
                title="No preferences set yet"
                description="Set a preferred FBO, catering defaults, and how we reach you."
                action={<Button asChild><Link href="/request">Set preferences on a request</Link></Button>}
              />
            )}
          </div>
        </div>
      </Container>
    </>
  );
}
