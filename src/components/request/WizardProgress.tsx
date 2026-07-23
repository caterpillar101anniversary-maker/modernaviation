/**
 * CL-2 — the wizard progress track (§13.2). A horizontal Course Line with
 * waypoints. Completed waypoints are filled course-500 dots; the current is a
 * 10px ring; upcoming are line-300. The segment behind the current position is
 * solid, ahead is dashed.
 */
const labels = ["Route", "Aircraft", "Contact", "Review"];

export function WizardProgress({ current }: { current: number }) {
  return (
    <div className="w-full">
      <div className="relative flex items-center justify-between">
        {/* Track behind the waypoints */}
        <span aria-hidden className="absolute inset-x-0 top-[7px] h-px bg-line-300" />
        <span
          aria-hidden
          className="absolute left-0 top-[7px] h-px bg-course-500 transition-[width] duration-320"
          style={{ width: `${(current / (labels.length - 1)) * 100}%` }}
        />
        {labels.map((label, i) => {
          const done = i < current;
          const isCurrent = i === current;
          return (
            <div key={label} className="relative z-10 flex flex-col items-center gap-2">
              <span
                className="grid h-4 w-4 place-items-center rounded-pill bg-haze-100"
                aria-current={isCurrent ? "step" : undefined}
              >
                {done ? (
                  <span className="h-3.5 w-3.5 rounded-pill bg-course-500" />
                ) : isCurrent ? (
                  <span className="h-3.5 w-3.5 rounded-pill border-2 border-course-500 bg-haze-100" />
                ) : (
                  <span className="h-2.5 w-2.5 rounded-pill bg-line-300" />
                )}
              </span>
              <span
                className={
                  "type-label " + (i <= current ? "text-ink-700" : "text-ink-400")
                }
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
