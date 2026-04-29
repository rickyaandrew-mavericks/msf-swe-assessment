import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "MSF Licensing Portal",
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-primary">
        <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6">
          <span className="font-heading font-semibold text-white text-base">
            MSF Licensing Portal
          </span>
        </div>
      </header>

      <main id="main-content" className="flex-1 mx-auto max-w-4xl w-full px-4 py-16 sm:px-6">
        <div className="max-w-xl">
          <span className="text-xs font-semibold uppercase tracking-widest text-accent mb-4 block">
            Ministry of Social and Family Development
          </span>
          <h1 className="font-heading text-3xl font-semibold text-primary sm:text-4xl leading-tight">
            Social Service Licensing Portal
          </h1>
          <p className="mt-4 text-secondary text-lg leading-relaxed">
            Submit and manage licence applications for social service organisations
            regulated by the Ministry of Social and Family Development.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/application"
              className="inline-flex items-center justify-center min-h-[44px] px-6 py-2 rounded-md bg-primary text-white font-medium text-base hover:bg-secondary transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              New Licence Application
            </Link>
            <Link
              href="/all-applications"
              className="inline-flex items-center justify-center min-h-[44px] px-6 py-2 rounded-md border border-border bg-white text-primary font-medium text-base hover:bg-muted transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              View All Applications
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t border-border bg-white">
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
          <p className="text-center text-xs text-secondary">
            © {new Date().getFullYear()} Ministry of Social and Family Development. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
