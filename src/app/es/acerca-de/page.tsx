import type { Metadata } from "next";
import Link from "next/link";

import { LocaleSwitcher } from "@/components/i18n/LocaleSwitcher";
import { getLocalePublicationState } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const publication = await getLocalePublicationState("es");
  return {
    title: "Acerca de RGuide Travel",
    description: "Descubre cómo RGuide Travel organiza guías urbanas seleccionadas por ciudad, barrio y contexto de viaje.",
    alternates: { canonical: "/es/acerca-de", languages: { en: "/about", es: "/es/acerca-de", "x-default": "/about" } },
    robots: publication.indexable ? undefined : { index: false, follow: true },
  };
}

export default function SpanishAboutPage() {
  return (
    <>
      <main className="page-shell py-10">
        <section className="surface p-6 sm:p-8" aria-labelledby="about-heading">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-orange-600">Acerca de</p>
          <h1 id="about-heading" className="mt-2 text-4xl font-semibold text-slate-900">RGuide Travel</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
            RGuide Travel es un índice de planificación para guías urbanas con criterio propio. Organiza restaurantes,
            alojamientos, bares, cultura, naturaleza, actividades y rutas según la forma en que una persona recorre un lugar:
            por ciudad, barrio, categoría y propósito del viaje.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              ["Selección editorial", "Las guías están pensadas para planificar viajes útiles, no para cubrir directorios genéricos."],
              ["El mapa primero", "Los lugares se agrupan para entender la geografía, los tiempos y las decisiones antes de viajar."],
              ["Fuentes visibles", "Las notas editoriales, las fuentes públicas y las señales locales ayudan a mantener recomendaciones útiles."],
            ].map(([title, description]) => (
              <article key={title} className="rounded-lg border border-slate-950/10 bg-white p-4">
                <h2 className="text-base font-semibold text-slate-950">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
              </article>
            ))}
          </div>
          <section className="mt-10 border-t border-slate-950/10 pt-8" aria-labelledby="process-heading">
            <h2 id="process-heading" className="text-2xl font-semibold text-slate-950">Cómo se crean las guías</h2>
            <div className="mt-5 grid gap-5 md:grid-cols-3">
              {[
                ["Investigación", "La investigación comienza con las fuentes oficiales del lugar y del destino, y continúa con referencias editoriales actuales y señales locales."],
                ["Selección", "Cada parada se elige por su calidad, utilidad práctica, encaje geográfico y función dentro de un barrio o una ruta."],
                ["Mantenimiento", "Los horarios, reservas, estados de los lugares y enlaces de fuentes se revisan cuando se actualizan las guías."],
              ].map(([title, description]) => (
                <article key={title}>
                  <h3 className="text-base font-semibold text-slate-950">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
                </article>
              ))}
            </div>
          </section>
          <section className="mt-10 border-t border-slate-950/10 pt-8" aria-labelledby="independence-heading">
            <h2 id="independence-heading" className="text-2xl font-semibold text-slate-950">Correcciones e independencia editorial</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
              Algunas reservas pueden generar una comisión, pero las relaciones de afiliación no garantizan presencia ni cobertura positiva. Consulta la{" "}
              <Link href="/es/divulgacion-afiliados" className="font-medium text-orange-700 hover:text-orange-800">divulgación de afiliados</Link>.
            </p>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
              Los viajeros y los negocios pueden comunicar cierres, cambios de horario o errores de fuentes desde la{" "}
              <Link href="/es/contacto" className="font-medium text-orange-700 hover:text-orange-800">página de contacto</Link>.
            </p>
          </section>
        </section>
      </main>
      <LocaleSwitcher locale="es" links={{ en: "/about", es: "/es/acerca-de" }} />
    </>
  );
}
