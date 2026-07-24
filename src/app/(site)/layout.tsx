import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BottomTabBar } from "@/components/layout/BottomTabBar";
import { getSessionUser } from "@/lib/session";

/**
 * Shared chrome for every marketing/application page (§13). The wizard
 * (/request) and auth pages live outside this group with their own minimal
 * chrome. The header reflects the signed-in user.
 */
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  return (
    <>
      <Header user={user ? { firstName: user.firstName } : null} />
      <main className="flex-1 pb-16 lg:pb-0">{children}</main>
      <Footer />
      <BottomTabBar />
    </>
  );
}
