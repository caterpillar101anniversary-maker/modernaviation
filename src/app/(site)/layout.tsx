import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BottomTabBar } from "@/components/layout/BottomTabBar";

/**
 * Shared chrome for every marketing/application page (§13). The wizard
 * (/request) and auth (/signin) live outside this group because they use their
 * own minimal chrome per §13.2 / §13.9.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex-1 pb-16 lg:pb-0">{children}</main>
      <Footer />
      <BottomTabBar />
    </>
  );
}
