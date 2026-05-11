import { HomeServerContent } from "@/components/home/HomeServerContent";
import { SplitScreenClientLoader } from "@/components/home/SplitScreenClientLoader";
import { ProgressiveEnhancementShell } from "@/components/shared/ProgressiveEnhancementShell";
import { getContinentsWithDestinationDescriptions } from "@/lib/destination-descriptions";
import { getServerEditorialGuides } from "@/lib/server-editorial-guides";

export const revalidate = 900;

export default async function HomePage() {
  const [continents, editorialGuides] = await Promise.all([
    getContinentsWithDestinationDescriptions(),
    getServerEditorialGuides(),
  ]);

  return (
    <>
      <section className="page-shell pt-8" aria-labelledby="publisher-review-heading">
        <div className="rounded-lg border border-cyan-900/15 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-800">RGuide travel guides</p>
          <h1 id="publisher-review-heading" className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
            Independent city travel guides with hotel and stay recommendations
          </h1>
          <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-600">
            RGuide is a public travel guide site for planning where to stay, eat, and spend time in major cities. The site includes accommodation-led guides with hotel and hostel recommendations, neighborhood stay advice, and booking links for travelers comparing city bases.
          </p>
          <nav className="mt-4 flex flex-wrap gap-3 text-sm font-semibold" aria-label="Accommodation guide examples">
            <a href="/category/stay" className="rounded-md bg-cyan-800 px-3 py-2 text-white hover:bg-cyan-900">
              Stay guides
            </a>
            <a href="/city/barcelona/stay/best-hotels" className="rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-700 hover:border-cyan-200 hover:text-cyan-800">
              Best hotels in Barcelona
            </a>
            <a href="/city/rome/stay/best-hotels" className="rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-700 hover:border-cyan-200 hover:text-cyan-800">
              Best hotels in Rome
            </a>
          </nav>
        </div>
      </section>
      <ProgressiveEnhancementShell
        fallback={<HomeServerContent continents={continents} editorialGuides={editorialGuides} />}
      >
        <SplitScreenClientLoader />
      </ProgressiveEnhancementShell>
    </>
  );
}
