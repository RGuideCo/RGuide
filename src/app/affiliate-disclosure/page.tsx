import type { Metadata } from "next";
import { getLocalePublicationState } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const spanish = await getLocalePublicationState("es");
  return {
    title: "Affiliate Disclosure",
    description: "RGuide affiliate disclosure for booking and travel partner links.",
    alternates: { canonical: "/affiliate-disclosure", languages: spanish.indexable ? { en: "/affiliate-disclosure", es: "/es/divulgacion-afiliados", "x-default": "/affiliate-disclosure" } : undefined },
  };
}

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
            hostels, activities, or other travel services through Stay22 and other booking partners.
            This does not change the price you pay.
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
