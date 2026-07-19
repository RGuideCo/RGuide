import type { Metadata } from "next";

import { LocaleSwitcher } from "@/components/i18n/LocaleSwitcher";
import { getLocalePublicationState } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const publication = await getLocalePublicationState("es");
  return {
    title: "Condiciones de uso",
    description: "Condiciones de uso de RGuide para el contenido de viaje y las funciones del sitio.",
    alternates: { canonical: "/es/terminos", languages: { en: "/terms", es: "/es/terminos", "x-default": "/terms" } },
    robots: publication.indexable ? undefined : { index: false, follow: true },
  };
}

export default function SpanishTermsPage() {
  return (
    <>
      <main className="page-shell py-10">
        <article className="surface p-6 sm:p-8" aria-labelledby="terms-heading">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-orange-600">Condiciones</p>
          <h1 id="terms-heading" className="mt-2 text-4xl font-semibold text-slate-900">Condiciones de uso</h1>
          <div className="mt-6 space-y-5 text-sm leading-7 text-slate-600">
            <p>RGuide ofrece contenido de planificación de viajes con fines informativos. Los listados, precios, horarios, disponibilidad, condiciones de seguridad y accesos pueden cambiar; confirma los detalles importantes con los negocios, transportistas y servicios de reserva.</p>
            <p>Las guías y aportaciones de usuarios deben ser legales, precisas según el conocimiento de quien las envía y respetar los derechos de terceros. RGuide puede editar, retirar o rechazar contenido inexacto, abusivo o promocional sin la debida divulgación.</p>
            <p>RGuide no es responsable de sitios de terceros, plataformas de reserva, operaciones de negocios ni resultados de viaje. Usa el sitio con criterio propio y planifica según las condiciones locales actuales.</p>
            <p>Para consultas sobre estas condiciones, escribe a <a href="mailto:hello@rguide.co" className="font-medium text-orange-700 hover:text-orange-800">hello@rguide.co</a>.</p>
          </div>
        </article>
      </main>
      <LocaleSwitcher locale="es" links={{ en: "/terms", es: "/es/terminos" }} />
    </>
  );
}
