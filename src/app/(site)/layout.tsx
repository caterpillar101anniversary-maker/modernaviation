import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

/**
 * Shared chrome for every marketing page (§13). The wizard (/request) lives
 * outside this group with its own minimal chrome.
 *
 * Mobile and desktop carry the same navigation — the header collapses into a
 * hamburger rather than offering a separate set of mobile-only destinations.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
