/**
 * Single source of the brand name (design.md §0). If the brand changes,
 * it changes here and nowhere else.
 */
export const brand = {
  name: "Modern Aviation CLT",
  wordmark: "MODERN AVIATION",
  tagline:
    "Private jet charter from Charlotte Douglas, quoted in twenty minutes.",
  // A visible phone number is a trust element for this audience (§13.1 §7).
  phoneDisplay: "+1 704-777-0440",
  phoneHref: "tel:+17043590440",
  email: "CLT@modern-aviation.com",
  // Legally load-bearing disclosure — never remove for visual balance (§11.13).
  disclosure:
    "Modern Aviation CLT arranges charter as an agent and does not operate aircraft. All flights are operated by third-party air carriers holding an FAA Part 135 air carrier certificate.",
  certificate:
    "Based at Charlotte Douglas International Airport (KCLT) · ARINC 129.4",
  address: "5400 Airport Dr, Charlotte, NC 28208, United States",
} as const;
