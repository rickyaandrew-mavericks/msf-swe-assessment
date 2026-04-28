import type { Metadata } from "next";
import { ApplicationForm } from "./ApplicationForm";

export const metadata: Metadata = {
  title: "New Licence Application — MSF Licensing Portal",
  description: "Submit a new social service licence application to the Ministry of Social and Family Development.",
};

export default function ApplicationPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Portal header */}
      <header className="bg-primary border-b border-primary/20">
        <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded bg-accent">
              <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
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
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-2 text-sm text-secondary">
            <li>
              <a href="/" className="hover:text-accent transition-colors duration-150">
                Home
              </a>
            </li>
            <li aria-hidden="true" className="text-border">
              /
            </li>
            <li className="text-foreground font-medium" aria-current="page">
              New Licence Application
            </li>
          </ol>
        </nav>

        {/* Page title */}
        <div className="mb-8">
          <h1 className="font-heading text-2xl font-semibold text-primary sm:text-3xl">
            Licence Application Form
          </h1>
          <p className="mt-2 text-secondary">
            Complete all sections below. Fields marked with{" "}
            <span className="text-destructive font-medium" aria-label="asterisk">*</span>{" "}
            are required.
          </p>
        </div>

        <ApplicationForm />
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
