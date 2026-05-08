import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About RGuide",
  description: "Learn how RGuide organizes curated travel guides by city, neighborhood, and trip context.",
};

export default function AboutPage() {
  return (
    <main className="page-shell py-10">
      <section className="surface p-6 sm:p-8" aria-labelledby="about-heading">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-orange-600">About</p>
        <h1 id="about-heading" className="mt-2 text-4xl font-semibold text-slate-900">
          RGuide
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
          RGuide is a travel-planning index for opinionated city guides. It organizes restaurants, stays,
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
        <p className="mt-8 text-sm text-slate-600">
          Questions, corrections, and partnership notes can be sent through the{" "}
          <Link href="/contact" className="font-medium text-orange-700 hover:text-orange-800">
            contact page
          </Link>
          .
        </p>
      </section>
    </main>
  );
}
