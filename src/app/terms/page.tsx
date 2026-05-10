import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "RGuide terms of use for travel guide content and site features.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  return (
    <main className="page-shell py-10">
      <article className="surface p-6 sm:p-8" aria-labelledby="terms-heading">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-orange-600">Terms</p>
        <h1 id="terms-heading" className="mt-2 text-4xl font-semibold text-slate-900">
          Terms of Use
        </h1>
        <div className="mt-6 space-y-5 text-sm leading-7 text-slate-600">
          <p>
            RGuide provides travel-planning content for general information. Listings, prices, hours,
            availability, safety conditions, and access details can change, so travelers should confirm
            important details directly with venues, transportation providers, and booking services.
          </p>
          <p>
            Guides and user submissions must be lawful, accurate to the contributor's knowledge, and not
            infringe the rights of others. RGuide may edit, remove, or decline content that is inaccurate,
            abusive, promotional without disclosure, or otherwise unsuitable for the service.
          </p>
          <p>
            RGuide is not responsible for third-party websites, booking platforms, venue operations, or
            travel outcomes. Use the site at your own discretion and plan around current local conditions.
          </p>
          <p>
            For terms questions, email{" "}
            <a href="mailto:hello@rguide.co" className="font-medium text-orange-700 hover:text-orange-800">
              hello@rguide.co
            </a>
            .
          </p>
        </div>
      </article>
    </main>
  );
}
