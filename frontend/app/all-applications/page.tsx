import type { Metadata } from "next";
import Link from "next/link";
import { getApplications } from "@/lib/api";
import { StatusBadge } from "@/components/domain/StatusBadge";

export const metadata: Metadata = {
  title: "All Applications — MSF Licensing Portal",
};

export default async function AllApplicationsPage() {
  const applications = await getApplications();

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary border-b border-primary/20">
        <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded bg-accent">
              <svg
                className="h-5 w-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div>
              <span className="text-white font-heading font-semibold text-base leading-tight block">
                MSF Licensing Portal
              </span>
              <span className="text-white/70 text-xs">
                Ministry of Social and Family Development
              </span>
            </div>
          </div>
        </div>
      </header>

      <main id="main-content" className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-2 text-sm text-secondary">
            <li>
              <Link href="/" className="hover:text-accent transition-colors duration-150">
                Home
              </Link>
            </li>
            <li aria-hidden="true" className="text-border">/</li>
            <li className="text-foreground font-medium" aria-current="page">
              All Applications
            </li>
          </ol>
        </nav>

        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl font-semibold text-primary sm:text-3xl">
              All Applications
            </h1>
            <p className="mt-1 text-secondary">
              {applications.length === 0
                ? "No applications submitted yet."
                : `${applications.length} application${applications.length !== 1 ? "s" : ""} found`}
            </p>
          </div>
          <Link
            href="/application"
            className="inline-flex items-center justify-center min-h-[44px] px-4 py-2 rounded-md bg-primary text-white text-sm font-medium hover:bg-secondary transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 shrink-0"
          >
            New Application
          </Link>
        </div>

        {applications.length === 0 ? (
          <div className="rounded-lg border border-border bg-white p-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-secondary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="mt-4 font-heading text-base font-medium text-primary">
              No applications yet
            </p>
            <p className="mt-1 text-sm text-secondary">
              Submit your first licence application to get started.
            </p>
            <Link
              href="/application"
              className="mt-6 inline-flex items-center justify-center min-h-[44px] px-5 py-2 rounded-md bg-primary text-white text-sm font-medium hover:bg-secondary transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Start Application
            </Link>
          </div>
        ) : (
          <div className="rounded-lg border border-border bg-white overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted">
                  <th className="px-4 py-3 text-left font-semibold text-foreground">
                    Reference
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground hidden sm:table-cell">
                    Business Name
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground hidden md:table-cell">
                    Licence Type
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground hidden lg:table-cell">
                    Submitted
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-foreground">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {applications.map((app) => (
                  <tr
                    key={app.id}
                    className="hover:bg-muted/50 transition-colors duration-100"
                  >
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs text-secondary">
                        {app.id.split("-")[0]?.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="font-medium text-foreground">
                        {app.businessName}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-secondary">
                      {app.licenceType}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={app.status} size="sm" />
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-secondary">
                      {new Date(app.createdAt).toLocaleDateString("en-SG", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/application/${app.id}`}
                        className="text-accent hover:underline font-medium focus:outline-none focus:ring-2 focus:ring-ring rounded"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <footer className="mt-16 border-t border-border bg-white">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
          <p className="text-center text-xs text-secondary">
            © {new Date().getFullYear()} Ministry of Social and Family Development. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
