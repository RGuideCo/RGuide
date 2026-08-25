import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";

import { CATEGORIES } from "@/lib/constants";
import { isIndexableEditorialGuide } from "@/lib/deep-link-routes";
import { getCitiesFromContinents } from "@/lib/geography-tree";
import { getCategoryFromLocalizedSlug } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import {
  getLocalizedCategoryIndexPath,
  getLocalizedGuidePath,
} from "@/lib/i18n/paths";
import {
  findDestinationRouteTranslation,
  getDestinationRouteTranslations,
  getLocalePublicationState,
} from "@/lib/i18n/server";
import { getContinents } from "@/lib/mock-data";
import { getAbsoluteHref, getCategoryHref } from "@/lib/routes";
import { getServerEditorialGuides } from "@/lib/server-editorial-guides";
import { serializeJsonForHtml } from "@/lib/serialize-json";
import type { ListCategory, MapList } from "@/types";

interface SpanishCategoryPageProps {
  params: Promise<{ category: string }>;
}

export const dynamic = "force-static";
export const revalidate = 300;

const CATEGORY_INTROS: Record<ListCategory, string> = {
  Food: "Explora guías de restaurantes y comida por ciudad y barrio: mercados, casas de comidas, barras informales y mesas que justifican el viaje.",
  Nightlife: "Encuentra bares, pubs, clubes, coctelerías y salas de música organizados según la ciudad, el barrio y el tipo de noche que quieras vivir.",
  Nature: "Descubre parques, jardines, paseos marítimos, miradores y rutas al aire libre para equilibrar el ritmo de la ciudad.",
  Culture: "Recorre museos, galerías, monumentos, teatros, espacios de diseño y barrios que ayudan a comprender mejor cada ciudad.",
  Stay: "Compara guías de hoteles y hostales por ciudad y barrio, con contexto práctico sobre transporte, ambiente, precio y ubicación.",
  Activities: "Planifica qué hacer con rutas urbanas, planes de un día y guías que conectan comida, cultura, parques y vida nocturna.",
  Routes: "Sigue recorridos urbanos pensados para moverte con lógica entre barrios, monumentos, restaurantes y paradas que merece la pena guardar.",
  Essentials: "Consulta guías prácticas para elegir barrio, alojamiento y transporte, y tomar las decisiones básicas que definen un viaje.",
};

const CATEGORY_TITLES: Record<ListCategory, string> = {
  Food: "Guías de restaurantes y comida por ciudad",
  Nightlife: "Guías de bares y vida nocturna por ciudad",
  Nature: "Guías de parques y naturaleza por ciudad",
  Culture: "Guías de museos y cultura por ciudad",
  Stay: "Guías de hoteles y hostales por ciudad",
  Activities: "Qué hacer y rutas urbanas",
  Routes: "Rutas a pie e itinerarios urbanos",
  Essentials: "Consejos y datos esenciales de viaje",
};

function getLocalizedGuideHref(
  guide: MapList,
  destinationTranslations: Awaited<ReturnType<typeof getDestinationRouteTranslations>>,
) {
  if (!guide.location.city) return null;
  const city = getCitiesFromContinents(getContinents()).find((item) => item.name === guide.location.city);
  if (!city) return null;
  const cityTranslation = findDestinationRouteTranslation(destinationTranslations, {
    id: city.id,
    name: city.name,
    scope: "city",
  });
  if (!cityTranslation) return null;
  const neighborhoods = (city.subareas ?? []).flatMap((subarea) => [subarea, ...(subarea.subareas ?? [])]);
  const neighborhood = guide.location.neighborhood
    ? neighborhoods.find((item) => item.name === guide.location.neighborhood)
    : undefined;
  const neighborhoodTranslation = neighborhood
    ? findDestinationRouteTranslation(destinationTranslations, {
        id: neighborhood.id,
        name: neighborhood.name,
        scope: "neighborhood",
      })
    : undefined;
  return getLocalizedGuidePath(
    "es",
    city,
    guide,
    neighborhood,
    cityTranslation.slug,
    neighborhoodTranslation?.slug,
  );
}

async function loadCategory(categorySlug: string) {
  const category = getCategoryFromLocalizedSlug("es", categorySlug);
  if (!category) return null;
  const [guides, publication, destinationTranslations] = await Promise.all([
    getServerEditorialGuides({ locale: "es" }),
    getLocalePublicationState("es"),
    getDestinationRouteTranslations("es"),
  ]);
  const lists = guides.filter(isIndexableEditorialGuide).filter((guide) => guide.category === category);
  return { category, guides, lists, publication, destinationTranslations };
}

export async function generateMetadata({ params }: SpanishCategoryPageProps): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const data = await loadCategory(categorySlug);
  if (!data) return { title: "Categoría no encontrada", robots: { index: false, follow: true } };
  const canonical = getLocalizedCategoryIndexPath("es", data.category);
  const english = getCategoryHref(data.category);
  const indexable = data.publication.indexable && data.lists.length >= 2;
  return {
    title: CATEGORY_TITLES[data.category],
    description: CATEGORY_INTROS[data.category],
    alternates: {
      canonical,
      languages: { en: english, es: canonical, "x-default": english },
    },
    robots: indexable ? undefined : { index: false, follow: true },
    openGraph: {
      title: CATEGORY_TITLES[data.category],
      description: CATEGORY_INTROS[data.category],
      url: canonical,
      locale: "es_ES",
      type: "website",
    },
  };
}

export default async function SpanishCategoryPage({ params }: SpanishCategoryPageProps) {
  const { category: categorySlug } = await params;
  const data = await loadCategory(categorySlug);
  if (!data) notFound();
  const canonicalPath = getLocalizedCategoryIndexPath("es", data.category);
  if (`/es/categoria/${categorySlug}` !== canonicalPath) permanentRedirect(canonicalPath);
  const dictionary = getDictionary("es");
  const linkedLists = data.lists.flatMap((guide) => {
    const href = getLocalizedGuideHref(guide, data.destinationTranslations);
    return href ? [{ guide, href }] : [];
  });
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${getAbsoluteHref(canonicalPath)}#webpage`,
    name: CATEGORY_TITLES[data.category],
    description: CATEGORY_INTROS[data.category],
    url: getAbsoluteHref(canonicalPath),
    inLanguage: "es",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: linkedLists.length,
      itemListElement: linkedLists.slice(0, 50).map(({ guide, href }, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: guide.seoTitle ?? guide.title,
        url: getAbsoluteHref(href),
      })),
    },
  };

  return (
    <>
    <main className="page-shell py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonForHtml(jsonLd) }} />
      <header className="max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-orange-600">Categoría</p>
        <h1 className="mt-2 text-4xl font-semibold text-slate-900">{CATEGORY_TITLES[data.category]}</h1>
        <p className="mt-3 text-slate-600">{CATEGORY_INTROS[data.category]}</p>
      </header>

      <nav aria-label="Categorías" className="mt-8 flex flex-wrap gap-2">
        {CATEGORIES.map((category) => (
          <Link
            key={category}
            href={getLocalizedCategoryIndexPath("es", category)}
            className={`rounded border px-3 py-2 text-sm font-semibold ${
              category === data.category
                ? "border-slate-950 bg-slate-950 text-white"
                : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
            }`}
          >
            {dictionary.categories[category]}
          </Link>
        ))}
      </nav>

      <section className="mt-8 grid gap-4 lg:grid-cols-2" aria-label={CATEGORY_TITLES[data.category]}>
        {linkedLists.map(({ guide, href }) => (
          <article key={guide.id} className="rounded border border-slate-950/10 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              {[guide.location.neighborhood, guide.location.city, guide.location.country].filter(Boolean).join(" / ")}
            </p>
            <h2 className="mt-2 text-lg font-semibold leading-6 text-slate-950">
              <Link href={href} className="hover:text-orange-700">{guide.seoTitle ?? guide.title}</Link>
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{guide.description}</p>
            <p className="mt-4 border-t border-slate-100 pt-3 text-xs font-semibold text-slate-700">
              {guide.stops.length} lugares en el mapa
            </p>
          </article>
        ))}
      </section>
    </main>
    </>
  );
}
