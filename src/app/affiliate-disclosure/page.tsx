import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Affiliate Disclosure",
  description: "RGuide affiliate disclosure for booking and travel partner links.",
  alternates: {
    canonical: "/affiliate-disclosure",
  },
};

export default function AffiliateDisclosurePage() {
  return (
    <main className="page-shell py-10">
      <article className="surface p-6 sm:p-8" aria-labelledby="affiliate-disclosure-heading">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-orange-600">Disclosure</p>
        <h1 id="affiliate-disclosure-heading" className="mt-2 text-4xl font-semibold text-slate-900">
          Affiliate Disclosure
        </h1>
        <div className="mt-6 space-y-5 text-sm leading-7 text-slate-600">
          <p>
            RGuide may earn a commission when visitors use partner or affiliate links to book hotels,
            hostels, activities, or other travel services. This does not change the price you pay.
            As a Booking.com Affiliate, I earn from qualifying transactions.
          </p>
          <p>
            Recommendations are selected for location fit, planning usefulness, and editorial relevance.
            Affiliate relationships do not guarantee placement, ranking, or positive coverage.
          </p>
          <p>
            When a page includes affiliate links, travelers should still review current prices, policies,
            availability, cancellation terms, and venue details directly with the booking provider before
            making a reservation.
          </p>
          <p>
            Questions about partnerships or disclosures can be sent to{" "}
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
