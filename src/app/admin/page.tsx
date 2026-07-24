import Link from "next/link";
import { Inbox } from "lucide-react";
import { AdminLogin } from "@/app/admin/AdminLogin";
import { AdminShell } from "@/app/admin/AdminShell";
import { Badge } from "@/components/primitives/Badge";
import { prisma } from "@/lib/db";
import { adminPasswordMissing, isAdmin } from "@/lib/admin";
import { formatSubmitted, readLegs, routeSummary, statusTone, TRIP_TYPE_LABEL } from "@/lib/request";

export const metadata = { title: "Admin · Flight requests", robots: { index: false, follow: false } };

export default async function AdminPage() {
  if (!(await isAdmin())) return <AdminLogin configured={!adminPasswordMissing()} />;

  const requests = await prisma.flightRequest
    .findMany({ orderBy: { createdAt: "desc" }, take: 200 })
    .catch(() => []);

  return (
    <AdminShell
      title="Flight requests"
      subtitle={
        requests.length === 0
          ? "Nothing has come in yet."
          : `${requests.length} ${requests.length === 1 ? "request" : "requests"}, newest first.`
      }
    >
      {requests.length === 0 ? (
        <div className="rounded-card border border-line-200 bg-paper p-12 text-center">
          <Inbox size={40} strokeWidth={1.5} className="mx-auto text-ink-400" aria-hidden />
          <p className="mt-4 type-body text-ink-600">
            Requests submitted from the site appear here as soon as they&apos;re sent.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-card border border-line-200 bg-paper">
          {/* Table on desktop, stacked cards below — the row is a single link
              either way so the whole record is one tap target. */}
          <div className="hidden h-11 items-center gap-4 bg-haze-050 px-4 lg:flex">
            <span className="w-28 type-label text-ink-400">Reference</span>
            <span className="w-40 type-label text-ink-400">Submitted</span>
            <span className="flex-1 type-label text-ink-400">Customer</span>
            <span className="w-44 type-label text-ink-400">Route</span>
            <span className="w-16 type-label text-ink-400">Pax</span>
            <span className="w-24 type-label text-ink-400">Status</span>
          </div>

          <ul>
            {requests.map((r, i) => {
              const legs = readLegs(r.legs);
              return (
                <li key={r.id} className={i < requests.length - 1 ? "border-b border-line-200" : ""}>
                  <Link
                    href={`/admin/${r.id}`}
                    className="flex flex-col gap-2 px-4 py-4 transition-colors duration-120 hover:bg-haze-050 lg:flex-row lg:items-center lg:gap-4 lg:py-3"
                  >
                    <span className="type-data text-course-500 lg:w-28">{r.reference}</span>
                    <span className="type-data-sm text-ink-400 lg:w-40">
                      {formatSubmitted(r.createdAt)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block type-body text-ink-700">{r.name}</span>
                      <span className="block truncate type-body-sm text-ink-400">{r.email}</span>
                    </span>
                    <span className="type-data text-ink-700 lg:w-44">
                      {routeSummary(legs)}
                      <span className="ml-2 type-body-sm text-ink-400">
                        {TRIP_TYPE_LABEL[r.tripType] ?? r.tripType}
                      </span>
                    </span>
                    <span className="type-data text-ink-700 lg:w-16">{r.passengers}</span>
                    <span className="lg:w-24">
                      <Badge tone={statusTone(r.status)}>{r.status}</Badge>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </AdminShell>
  );
}
