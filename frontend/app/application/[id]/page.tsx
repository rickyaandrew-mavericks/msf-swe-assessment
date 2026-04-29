import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getApplicationById } from "@/lib/api";
import { StatusBadge } from "@/components/domain/StatusBadge";
import type { CommentInfo } from "@/types/application";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Application ${id.split("-")[0]?.toUpperCase()} — MSF Licensing Portal`,
  };
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string | number | boolean;
}) {
  return (
    <div className="grid grid-cols-1 gap-1 sm:grid-cols-3 sm:gap-4 py-3 border-b border-border last:border-0">
      <dt className="text-sm font-medium text-secondary">{label}</dt>
      <dd className="text-sm text-foreground sm:col-span-2">
        {String(value)}
      </dd>
    </div>
  );
}

function OfficerComments({ comments }: { comments: CommentInfo[] }) {
  if (comments.length === 0) {
    return (
      <div className="mb-6 rounded-lg border border-dashed border-border bg-muted/30 px-5 py-6 text-center">
        <p className="text-sm text-secondary">
          No officer comments yet. Once reviewed, feedback will appear here.
        </p>
      </div>
    );
  }

  return (
    <section aria-labelledby="comments-heading" className="mb-8">
      <h2 id="comments-heading" className="sr-only">Officer Comments</h2>
      <div className="flex flex-col gap-4">
        {comments.map((c) => (
          <div key={c.id} className="rounded-lg border-2 border-accent/20 bg-white shadow-sm overflow-hidden">
            <div className="bg-accent/5 px-4 py-2 border-b border-accent/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-primary">{c.officer.name}</span>
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                  c.officer.role === "admin" ? "bg-purple-100 text-purple-700" :
                  c.officer.role === "officer" ? "bg-blue-100 text-blue-700" :
                  "bg-slate-100 text-slate-700"
                }`}>
                  {c.officer.role}
                </span>
              </div>
              <time className="text-xs font-medium text-secondary">
                {new Date(c.createdAt).toLocaleString("en-SG", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </time>
            </div>
            <div className="px-4 py-3 text-sm text-foreground whitespace-pre-wrap leading-relaxed">
              {c.comment}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default async function ApplicationDetailPage({ params }: Props) {
  const { id } = await params;
  const application = await getApplicationById(id);

  if (application === null) {
    notFound();
  }

  const isPendingPreSiteResubmission =
    application.status === "pending_pre_site_resubmission";

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary border-b border-primary/20">
        <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6">
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

      <main id="main-content" className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-2 text-sm text-secondary">
            <li>
              <Link href="/" className="hover:text-accent transition-colors duration-150">
                Home
              </Link>
            </li>
            <li aria-hidden="true" className="text-border">/</li>
            <li>
              <Link
                href="/all-applications"
                className="hover:text-accent transition-colors duration-150"
              >
                All Applications
              </Link>
            </li>
            <li aria-hidden="true" className="text-border">/</li>
            <li className="text-foreground font-medium font-mono" aria-current="page">
              {id.split("-")[0]?.toUpperCase()}
            </li>
          </ol>
        </nav>

        {/* Page title + status */}
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl font-semibold text-primary sm:text-3xl">
              {application.businessName}
            </h1>
            <p className="mt-1 text-sm text-secondary font-mono">
              Ref: {application.id}
            </p>
          </div>
          <StatusBadge status={application.status} size="md" />
        </div>

        {/* Officer Comments (Prominent Placement) */}
        <OfficerComments comments={application.comments} />

        {/* Pending Pre-Site Resubmission callout */}
        {isPendingPreSiteResubmission && (
          <div
            role="note"
            aria-label="Status information"
            className="mb-6 rounded-lg border border-amber-300 bg-amber-50 px-5 py-4 flex gap-3"
          >
            <svg
              className="h-5 w-5 text-amber-600 shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
              />
            </svg>
            <div>
              <p className="font-semibold text-amber-900 text-sm">
                Action Required: Pending Pre-Site Resubmission
              </p>
              <p className="mt-1 text-amber-800 text-sm">
                Your application is awaiting officer review before the site visit can be
                scheduled. You may be contacted to provide additional information or
                resubmit supporting documents. No action is required from you at this
                stage unless notified by a Licensing Officer.
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-6">
          {/* Status summary card */}
          <section
            aria-labelledby="status-heading"
            className="rounded-lg border border-border bg-white p-5"
          >
            <h2
              id="status-heading"
              className="font-heading text-base font-semibold text-primary mb-4"
            >
              Application Status
            </h2>
            <div className="flex flex-wrap items-center gap-4">
              <div>
                <p className="text-xs text-secondary mb-1">Current Status</p>
                <StatusBadge status={application.status} size="md" />
              </div>
              <div>
                <p className="text-xs text-secondary mb-1">Submitted</p>
                <p className="text-sm text-foreground font-medium">
                  {new Date(application.createdAt).toLocaleString("en-SG", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <div>
                <p className="text-xs text-secondary mb-1">Last Updated</p>
                <p className="text-sm text-foreground">
                  {new Date(application.updatedAt).toLocaleString("en-SG", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </section>

          {/* Personal details */}
          <section
            aria-labelledby="personal-heading"
            className="rounded-lg border border-border bg-white p-5"
          >
            <h2
              id="personal-heading"
              className="font-heading text-base font-semibold text-primary mb-2"
            >
              Personal Details
            </h2>
            <dl>
              <DetailRow label="Full Name" value={application.fullName} />
              <DetailRow label="NRIC / Passport" value={application.nricOrPassport} />
              <DetailRow
                label="Date of Birth"
                value={new Date(application.dateOfBirth).toLocaleDateString("en-SG", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              />
              <DetailRow label="Gender" value={application.gender} />
              <DetailRow label="Nationality" value={application.nationality} />
              <DetailRow label="Contact Number" value={application.contactNumber} />
              <DetailRow label="Email Address" value={application.email} />
            </dl>
          </section>

          {/* Residential details */}
          <section
            aria-labelledby="residential-heading"
            className="rounded-lg border border-border bg-white p-5"
          >
            <h2
              id="residential-heading"
              className="font-heading text-base font-semibold text-primary mb-2"
            >
              Residential Details
            </h2>
            <dl>
              <DetailRow label="Home Address" value={application.homeAddress} />
            </dl>
          </section>

          {/* Business details */}
          <section
            aria-labelledby="business-heading"
            className="rounded-lg border border-border bg-white p-5"
          >
            <h2
              id="business-heading"
              className="font-heading text-base font-semibold text-primary mb-2"
            >
              Business Details
            </h2>
            <dl>
              <DetailRow label="Business Name" value={application.businessName} />
              <DetailRow label="Business Address" value={application.businessAddress} />
              <DetailRow
                label="Years in Operation"
                value={application.yearsInOperation}
              />
              <DetailRow label="Licence Type" value={application.licenceType} />
            </dl>
          </section>

          {/* Supporting documents */}
          <section
            aria-labelledby="documents-heading"
            className="rounded-lg border border-border bg-white p-5"
          >
            <h2
              id="documents-heading"
              className="font-heading text-base font-semibold text-primary mb-4"
            >
              Supporting Documents
            </h2>
            <p className="text-xs text-secondary mb-3">
              Accepted: PDF only · Max 10 MB per file · Up to 5 files
            </p>
            {application.documents.length === 0 ? (
              <p className="text-sm text-secondary italic">
                No documents were uploaded with this application.
              </p>
            ) : (
              <ul className="flex flex-col gap-2" aria-label="Uploaded documents">
                {application.documents.map((doc) => (
                  <li
                    key={doc.id}
                    className="flex items-center gap-3 rounded-md border border-border bg-muted px-3 py-2 text-sm"
                  >
                    <svg
                      className="h-4 w-4 text-accent shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="font-medium text-foreground truncate flex-1">
                      {doc.originalName}
                    </span>
                    <span className="text-secondary shrink-0">
                      {formatBytes(doc.sizeBytes)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>

      <footer className="mt-16 border-t border-border bg-white">
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
          <p className="text-center text-xs text-secondary">
            © {new Date().getFullYear()} Ministry of Social and Family Development. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
