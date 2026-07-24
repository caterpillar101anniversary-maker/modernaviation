import { PageMasthead } from "@/components/layout/PageMasthead";
import { Container } from "@/components/layout/Container";
import { SpecTable } from "@/components/primitives/SpecTable";
import { TrustRow } from "@/components/aviation/TrustRow";

export const metadata = { title: "Safety & operators" };

export default function SafetyPage() {
  return (
    <>
      <PageMasthead
        eyebrow="Safety & operators"
        title="How we vet the operators we quote"
        description="This page's job is to be believed. So it is prose and records, not photographs."
      />

      <TrustRow />

      <Container className="py-14">
        {/* Reading column — 8 of 12 (§13.8) */}
        <div className="max-w-160">
          <div className="flex flex-col gap-6 type-body text-ink-600">
            <p>
              Modern Aviation CLT arranges charter as an agent. Every flight is operated by a
              third-party air carrier that holds its own FAA Part 135 certificate, and we quote an
              operator only after it clears the checks below — on the specific airframe, not the
              company in general.
            </p>
            <p>
              We hold a current independent safety audit on file for each operator — ARGUS or Wyvern —
              and we re-check it before every booking, because an audit that lapsed last month is not
              an audit. Where an operator or an airframe cannot produce a current record, we do not
              quote it, and we tell you why rather than quietly substituting another aircraft.
            </p>
            <p>
              On every quote we name the operator and state the registration of the aircraft you will
              fly. You are never asked to accept an unnamed &ldquo;or similar&rdquo; aircraft.
            </p>
          </div>

          <div className="mt-10">
            <h2 className="type-h2 text-ink-700">What we check</h2>
            <div className="mt-6">
              <SpecTable
                header={{ label: "Vetting criterion", value: "Requirement" }}
                rows={[
                  { label: "Air operator certificate", value: "Current, matched to route" },
                  { label: "Independent safety audit", value: "ARGUS or Wyvern, in date" },
                  { label: "Combined single-limit insurance", value: "$50M minimum", numeric: true },
                  { label: "Pilot-in-command total hours", value: "3,500 minimum", numeric: true },
                  { label: "PIC hours on type", value: "500 minimum", numeric: true },
                  { label: "Aircraft age", value: "≤ 15 years typical", numeric: true },
                  { label: "Maintenance programme", value: "Manufacturer-approved" },
                ]}
              />
            </div>
          </div>

          <div className="mt-10">
            <h2 className="type-h2 text-ink-700">If something isn&apos;t right</h2>
            <p className="mt-4 type-body text-ink-600">
              If an operator&apos;s paperwork can&apos;t be verified before departure, we cancel and
              refund rather than fly. That is the whole point of vetting — it has to be able to say no.
            </p>
          </div>
        </div>
      </Container>
    </>
  );
}
