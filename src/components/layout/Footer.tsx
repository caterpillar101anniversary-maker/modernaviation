import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Wordmark } from "@/components/layout/Wordmark";
import { brand } from "@/config/brand";

const columns: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Book",
    links: [
      { label: "Request a flight", href: "/request" },
      { label: "Empty legs", href: "/empty-legs" },
      { label: "Jet card", href: "/jet-card" },
    ],
  },
  {
    title: "Fleet",
    links: [
      { label: "All aircraft", href: "/fleet" },
      { label: "Light jets", href: "/fleet?category=light" },
      { label: "Super midsize", href: "/fleet?category=super-midsize" },
      { label: "Heavy & ultra-long-range", href: "/fleet?category=heavy" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Modern Aviation CLT", href: "/about" },
      { label: "Safety & operators", href: "/safety" },
      { label: "Careers", href: "/careers" },
      { label: "Contact dispatch", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms of use", href: "/legal/terms" },
      { label: "Privacy policy", href: "/legal/privacy" },
      { label: "Cancellation policy", href: "/legal/cancellation" },
      { label: "Charter agreement", href: "/legal/charter-agreement" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-ink-000 pt-20 pb-12 print:hidden">
      <Container>
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-[1.4fr_repeat(4,1fr)] md:gap-8">
          <div className="col-span-2 md:col-span-1">
            <Wordmark dark />
            <p className="mt-4 type-body-sm max-w-56 text-ink-ondark">
              On-demand private jet charter. Tell us the trip, get a firm quote
              in twenty minutes.
            </p>
            {/* <a
              href={brand.phoneHref}
              className="mt-4 inline-block type-data-lg text-paper transition-colors duration-120 hover:text-cyan-400"
            >
              {brand.phoneDisplay}
            </a> */}
          </div>

          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h2 className="type-label text-ink-ondark">{col.title}</h2>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="type-body-sm text-ink-ondark transition-colors duration-120 hover:text-paper"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Bottom bar — the disclosure here is legally load-bearing (§11.13). */}
        <div className="mt-16 border-t border-ink-800 pt-8">
          <p className="type-body-sm max-w-200 text-ink-400">
            {brand.disclosure}
          </p>
          <div className="mt-4 flex flex-col gap-1 md:flex-row md:items-center md:gap-6">
            <span className="type-data-sm text-ink-400">
              {brand.certificate}
            </span>
            <span className="type-data-sm text-ink-400">{brand.address}</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
