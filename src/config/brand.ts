/**
 * Single source of the brand name (design.md §0). If the brand changes,
 * it changes here and nowhere else.
 */
export const brand = {
  name: "Meridian",
  wordmark: "MERIDIAN",
  tagline: "Private jet charter, quoted in twenty minutes.",
  // A visible phone number is a trust element for this audience (§13.1 §7).
  phoneDisplay: "+234 1 631 0000",
  phoneHref: "tel:+2341631000",
  email: "charter@meridian.aero",
  // Legally load-bearing disclosure — never remove for visual balance (§11.13).
  disclosure:
    "Meridian arranges charter as an agent and does not operate aircraft. All flights are operated by third-party air carriers holding the appropriate air operator certificate.",
  certificate: "Registered in Nigeria · RC 7742119",
  address: "Wing C, Business Aviation Terminal, Murtala Muhammed Airport, Ikeja, Lagos",
} as const;
