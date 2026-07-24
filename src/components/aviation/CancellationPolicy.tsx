/**
 * Private charter cancellation terms are severe and disputes are common
 * (§9, §12.7). This text is shown in full — never collapsed, never a link-only
 * acknowledgement, and never softened for visual balance.
 */
export const cancellationTiers = [
  { window: "More than 168 hours before departure", fee: "10% of the charter price" },
  { window: "72–168 hours before departure", fee: "25% of the charter price" },
  { window: "24–72 hours before departure", fee: "50% of the charter price" },
  { window: "Less than 24 hours before departure", fee: "100% of the charter price" },
];

export function CancellationPolicy() {
  return (
    <div className="flex flex-col gap-4">
      <p className="type-body text-ink-600">
        Once you accept this quote and it is confirmed, the following cancellation charges apply,
        calculated on the total charter price and measured from the scheduled departure time. Charges
        set by the operator can be more restrictive on peak dates and international positioning;
        where they are, the stricter terms apply and will be stated before you pay.
      </p>
      <div className="overflow-hidden rounded-card border border-line-200">
        {cancellationTiers.map((t, i) => (
          <div
            key={t.window}
            className={
              "flex items-center justify-between gap-4 px-4 py-3 " +
              (i < cancellationTiers.length - 1 ? "border-b border-line-200" : "")
            }
          >
            <span className="type-body-sm text-ink-600">{t.window}</span>
            <span className="type-data-sm text-ink-700">{t.fee}</span>
          </div>
        ))}
      </div>
      <p className="type-body-sm text-ink-400">
        No-shows and diversions caused by incomplete or inaccurate passenger documentation are charged
        at 100%. Weather and air-traffic delays outside the operator&apos;s control are not grounds for
        a refund of a completed positioning flight.
      </p>
    </div>
  );
}
