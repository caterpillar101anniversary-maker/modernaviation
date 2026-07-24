import Link from "next/link";
import { Button } from "@/components/primitives/Button";
import { adminSignOut } from "@/app/actions/admin";

/** Chrome for every admin screen — deliberately plainer than the public site. */
export function AdminShell({
  title,
  subtitle,
  back,
  children,
}: {
  title: string;
  subtitle?: string;
  back?: { href: string; label: string };
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-haze-100">
      <header className="border-b border-line-200 bg-paper">
        <div className="mx-auto flex h-14 max-w-256 items-center justify-between px-5 sm:px-6 lg:h-18 lg:px-10">
          <Link href="/admin" className="rounded-control type-label text-ink-700">
            Modern Aviation CLT · Admin
          </Link>
          <form action={adminSignOut}>
            <Button type="submit" variant="ghost" size="sm">
              Sign out
            </Button>
          </form>
        </div>
      </header>

      <div className="mx-auto max-w-256 px-5 py-10 sm:px-6 lg:px-10">
        {back && (
          <Button asChild variant="ghost" size="sm" className="mb-4 px-0">
            <Link href={back.href}>← {back.label}</Link>
          </Button>
        )}
        <h1 className="type-h1 text-ink-700">{title}</h1>
        {subtitle && <p className="mt-2 type-body text-ink-400">{subtitle}</p>}
        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}
