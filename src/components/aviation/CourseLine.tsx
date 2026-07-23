/**
 * The Course Line — the product's signature (§2). It always encodes a real
 * route, sequence, or position. Magenta on light (course-500), course-400 on
 * dark. It is never a border, a button accent, or a loading bar.
 */

/** CL-5 — a 48px stub above a section eyebrow. Reads as one leg of a route. */
export function CourseLineStub({ dark = false }: { dark?: boolean }) {
  const color = dark ? "var(--color-course-400)" : "var(--color-course-500)";
  return (
    <svg
      width="48"
      height="8"
      viewBox="0 0 48 8"
      fill="none"
      aria-hidden
      className="block"
    >
      <line x1="0" y1="4" x2="40" y2="4" stroke={color} strokeWidth="1.5" />
      <circle cx="44" cy="4" r="3" fill={color} />
    </svg>
  );
}
