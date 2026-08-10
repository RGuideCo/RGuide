import type { Metadata } from "next";

import { getLocalePublicationState } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const publication = await getLocalePublicationState("es");
  return {
    title: "Contactar con RGuide Travel",
    description: "Contacta con RGuide Travel para correcciones editoriales, colaboraciones y consultas generales.",
    alternates: { canonical: "/es/contacto", languages: { en: "/contact", es: "/es/contacto", "x-default": "/contact" } },
    robots: publication.indexable ? undefined : { index: false, follow: true },
  };
}

export default function SpanishContactPage() {
  return (
    <>
      <main className="page-shell py-10">
        <section className="surface p-6 sm:p-8" aria-labelledby="contact-heading">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-orange-600">Contacto</p>
          <h1 id="contact-heading" className="mt-2 text-4xl font-semibold text-slate-900">Contactar con RGuide Travel</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
            Envía preguntas generales, propuestas de colaboración, actualizaciones de fuentes o solicitudes de corrección al correo adecuado.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {[
              ["General", "hello@rguide.co", "Preguntas sobre RGuide, colaboraciones y comentarios sobre el producto."],
              ["Editorial", "editorial@rguide.co", "Correcciones, fuentes, lugares ausentes y comentarios sobre las guías."],
            ].map(([label, email, description]) => (
              <article key={email} className="rounded-lg border border-slate-950/10 bg-white p-4">
                <h2 className="text-base font-semibold text-slate-950">{label}</h2>
                <a href={`mailto:${email}`} className="mt-2 block text-sm font-medium text-orange-700 hover:text-orange-800">{email}</a>
                <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
