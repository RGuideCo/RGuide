import type { Metadata } from "next";

import { getLocalePublicationState } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const publication = await getLocalePublicationState("es");
  return {
    title: "Política de privacidad",
    description: "Política de privacidad de RGuide y resumen del tratamiento de datos.",
    alternates: { canonical: "/es/privacidad", languages: { en: "/privacy", es: "/es/privacidad", "x-default": "/privacy" } },
    robots: publication.indexable ? undefined : { index: false, follow: true },
  };
}

export default function SpanishPrivacyPage() {
  return (
    <>
      <main className="page-shell py-10">
        <article className="surface p-6 sm:p-8" aria-labelledby="privacy-heading">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-orange-600">Privacidad</p>
          <h1 id="privacy-heading" className="mt-2 text-4xl font-semibold text-slate-900">Política de privacidad</h1>
          <div className="mt-6 space-y-5 text-sm leading-7 text-slate-600">
            <p>RGuide recopila únicamente la información necesaria para operar el sitio, mejorar las funciones de planificación y responder a mensajes. Si envías una guía o contactas con RGuide, la información proporcionada puede usarse para publicar, revisar o responder a esa solicitud.</p>
            <p>El sitio puede utilizar analítica y registros de alojamiento para entender el rendimiento, los errores, los patrones de tráfico y prevenir abusos. Estos registros pueden incluir información del navegador, dispositivo, referencia y ubicación aproximada.</p>
            <p>RGuide no vende información personal. Los servicios externos de alojamiento, analítica, mapas, correo y afiliación pueden tratar datos según sus propias políticas cuando se utilizan.</p>
            <p>Para consultas de privacidad o solicitudes de eliminación, escribe a <a href="mailto:hello@rguide.co" className="font-medium text-orange-700 hover:text-orange-800">hello@rguide.co</a>.</p>
          </div>
        </article>
      </main>
    </>
  );
}
