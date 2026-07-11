import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About RGuide Travel",
  description: "Learn how RGuide Travel organizes curated city travel guides by city, neighborhood, and trip context.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <main className="page-shell py-10">
      <section className="surface p-6 sm:p-8" aria-labelledby="about-heading">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-orange-600">About</p>
        <h1 id="about-heading" className="mt-2 text-4xl font-semibold text-slate-900">
          RGuide Travel
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
          RGuide Travel is a travel-planning index for opinionated city guides. It organizes restaurants, stays,
          bars, culture, nature, activities, and routes around how people actually move through a place:
          by city, neighborhood, category, and trip purpose.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            ["Curated", "Guides are selected for practical trip planning rather than generic directory coverage."],
            ["Map-first", "Places are grouped so travelers can understand geography, timing, and tradeoffs before they go."],
            ["Source-aware", "Editorial notes, public sources, and local signals help keep recommendations useful."],
          ].map(([title, description]) => (
            <article key={title} className="rounded-lg border border-slate-950/10 bg-white p-4">
              <h2 className="text-base font-semibold text-slate-950">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
            </article>
          ))}
        </div>

        <section className="mt-10 border-t border-slate-950/10 pt-8" aria-labelledby="editorial-process-heading">
          <h2 id="editorial-process-heading" className="text-2xl font-semibold text-slate-950">
            How the guides are built
          </h2>
          <div className="mt-5 grid gap-5 md:grid-cols-3">
            {[
              ["Research", "Guide research starts with official venue and destination sources, then uses current editorial references and local signals to verify what is open, relevant, and worth the trip."],
              ["Selection", "Stops are chosen for location fit, quality, practical usefulness, and the role they play in a neighborhood or route. A famous name does not earn automatic placement."],
              ["Maintenance", "Hours, booking details, venue status, and source links are reviewed as guides are revised. Material guide updates flow into the page's published update signals."],
            ].map(([title, description]) => (
              <article key={title}>
                <h3 className="text-base font-semibold text-slate-950">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10 border-t border-slate-950/10 pt-8" aria-labelledby="editorial-independence-heading">
          <h2 id="editorial-independence-heading" className="text-2xl font-semibold text-slate-950">
            Corrections and editorial independence
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
            Recommendations are selected for editorial relevance and trip-planning value. Some booking links may earn
            RGuide a commission, but affiliate relationships do not guarantee placement or positive coverage. Read the{" "}
            <Link href="/affiliate-disclosure" className="font-medium text-orange-700 hover:text-orange-800">
              affiliate disclosure
            </Link>{" "}
            for details.
          </p>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
            Travelers and venues can report closures, changed hours, source errors, or missing context through the{" "}
            <Link href="/contact" className="font-medium text-orange-700 hover:text-orange-800">
              contact page
            </Link>
            . Editorial corrections are reviewed separately from partnership requests.
          </p>
        </section>
      </section>
    </main>
  );
}
