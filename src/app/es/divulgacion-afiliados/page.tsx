import type { Metadata } from "next";

import { LocaleSwitcher } from "@/components/i18n/LocaleSwitcher";
import { getLocalePublicationState } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const publication = await getLocalePublicationState("es");
  return {
    title: "Divulgación de afiliados",
    description: "Divulgación de RGuide sobre enlaces de reserva y socios de viaje.",
    alternates: { canonical: "/es/divulgacion-afiliados", languages: { en: "/affiliate-disclosure", es: "/es/divulgacion-afiliados", "x-default": "/affiliate-disclosure" } },
    robots: publication.indexable ? undefined : { index: false, follow: true },
  };
}

export default function SpanishAffiliateDisclosurePage() {
  return (
    <>
      <main className="page-shell py-10">
        <article className="surface p-6 sm:p-8" aria-labelledby="affiliate-heading">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-orange-600">Divulgación</p>
          <h1 id="affiliate-heading" className="mt-2 text-4xl font-semibold text-slate-900">Divulgación de afiliados</h1>
          <div className="mt-6 space-y-5 text-sm leading-7 text-slate-600">
            <p>RGuide puede recibir una comisión cuando una persona utiliza enlaces de socios o afiliados para reservar hoteles, hostales, actividades u otros servicios de viaje mediante Stay22 u otros socios. Esto no cambia el precio pagado.</p>
            <p>Las recomendaciones se eligen por su ubicación, utilidad para planificar y relevancia editorial. Las relaciones de afiliación no garantizan presencia, posición ni cobertura positiva.</p>
            <p>Antes de reservar, revisa los precios, políticas, disponibilidad, condiciones de cancelación y detalles actuales directamente con el proveedor.</p>
            <p>Las preguntas sobre colaboraciones o divulgaciones pueden enviarse a <a href="mailto:hello@rguide.co" className="font-medium text-orange-700 hover:text-orange-800">hello@rguide.co</a>.</p>
          </div>
        </article>
      </main>
      <LocaleSwitcher locale="es" links={{ en: "/affiliate-disclosure", es: "/es/divulgacion-afiliados" }} />
    </>
  );
}
