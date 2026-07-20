"use client";

import { type MouseEvent, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type FooterModal = "about" | "contact" | "privacy" | "terms" | "affiliate-disclosure" | null;
type FooterModalId = Exclude<FooterModal, null>;

const contactLinks = [
  { href: "mailto:hello@rguide.co", label: "hello@rguide.co", detail: "General" },
  { href: "mailto:editorial@rguide.co", label: "editorial@rguide.co", detail: "Editorial" },
];

const aboutFaqs = [
  {
    question: "What is RGuide Travel?",
    answer:
      "RGuide Travel is a curated travel guide index built around useful city planning: where to eat, stay, go out, explore, and spend time.",
  },
  {
    question: "Who makes the guides?",
    answer:
      "RGuides are editorial guides made by RGuide. User guides can also appear when travelers submit lists, journeys, or saved recommendations.",
  },
  {
    question: "How are places chosen?",
    answer:
      "Guides are organized by location, category, and planning context, with sources and local signals used to keep each list practical rather than generic.",
  },
  {
    question: "Can I save places for a trip?",
    answer:
      "Yes. You can favorite guides and build journeys from places inside expanded guides.",
  },
  {
    question: "How do I suggest a correction?",
    answer:
      "Send corrections, source notes, or guide feedback to editorial@rguide.co.",
  },
];

const footerLinks: Array<{ href: string; label: string; modal: FooterModalId }> = [
  { href: "/about", label: "About", modal: "about" },
  { href: "/contact", label: "Contact", modal: "contact" },
  { href: "/privacy", label: "Privacy", modal: "privacy" },
  { href: "/terms", label: "Terms", modal: "terms" },
  { href: "/affiliate-disclosure", label: "Disclosure", modal: "affiliate-disclosure" },
];

const spanishFooterLinks: Array<{ href: string; label: string; modal: FooterModalId }> = [
  { href: "/es/acerca-de", label: "Acerca de", modal: "about" },
  { href: "/es/contacto", label: "Contacto", modal: "contact" },
  { href: "/es/privacidad", label: "Privacidad", modal: "privacy" },
  { href: "/es/terminos", label: "Condiciones", modal: "terms" },
  { href: "/es/divulgacion-afiliados", label: "Afiliados", modal: "affiliate-disclosure" },
];

const modalTitles: Record<FooterModalId, string> = {
  about: "About",
  contact: "Contact",
  privacy: "Privacy",
  terms: "Terms",
  "affiliate-disclosure": "Disclosure",
};

const spanishModalTitles: Record<FooterModalId, string> = {
  about: "Acerca de",
  contact: "Contacto",
  privacy: "Privacidad",
  terms: "Condiciones",
  "affiliate-disclosure": "Divulgación",
};

const spanishAboutFaqs = [
  { question: "¿Qué es RGuide Travel?", answer: "RGuide Travel es un índice de guías seleccionadas para planificar dónde comer, alojarse, salir y explorar una ciudad." },
  { question: "¿Quién crea las guías?", answer: "Las RGuides son guías editoriales de RGuide. También pueden aparecer guías, recorridos y recomendaciones guardadas por usuarios." },
  { question: "¿Cómo se eligen los lugares?", answer: "Las guías se organizan por ubicación, categoría y contexto, con fuentes y señales locales que mantienen cada lista práctica." },
  { question: "¿Puedo guardar lugares para un viaje?", answer: "Sí. Puedes marcar guías como favoritas y crear recorridos con los lugares de las guías ampliadas." },
  { question: "¿Cómo sugiero una corrección?", answer: "Envía correcciones, fuentes o comentarios sobre las guías a editorial@rguide.co." },
];

const policyCopy: Record<"privacy" | "terms" | "affiliate-disclosure", string[]> = {
  privacy: [
    "RGuide collects only the information needed to operate the site, improve travel-planning features, and respond to messages.",
    "The site may use analytics and hosting logs to understand page performance, errors, traffic patterns, and abuse prevention.",
    "RGuide does not sell personal information. Third-party services, including hosting, analytics, maps, email, and affiliate partners, may process data according to their own policies.",
    "For privacy questions or deletion requests, email hello@rguide.co.",
  ],
  terms: [
    "RGuide provides travel-planning content for general information. Listings, prices, hours, availability, safety conditions, and access details can change.",
    "Guides and user submissions must be lawful, accurate to the contributor's knowledge, and not infringe the rights of others.",
    "RGuide is not responsible for third-party websites, booking platforms, venue operations, or travel outcomes.",
    "For terms questions, email hello@rguide.co.",
  ],
  "affiliate-disclosure": [
    "RGuide may earn a commission when visitors use partner or affiliate links to book hotels, hostels, activities, or other travel services through Stay22 and other booking partners. This does not change the price you pay.",
    "Recommendations are selected for location fit, planning usefulness, and editorial relevance. Affiliate relationships do not guarantee placement, ranking, or positive coverage.",
    "When a page includes affiliate links, travelers should still review current prices, policies, availability, cancellation terms, and venue details directly with the booking provider before making a reservation.",
    "Questions about partnerships or disclosures can be sent to hello@rguide.co.",
  ],
};

const spanishPolicyCopy: Record<"privacy" | "terms" | "affiliate-disclosure", string[]> = {
  privacy: [
    "RGuide recopila únicamente la información necesaria para operar el sitio, mejorar sus funciones y responder a mensajes.",
    "El sitio puede utilizar analítica y registros de alojamiento para entender el rendimiento, los errores y los patrones de tráfico.",
    "RGuide no vende información personal. Los servicios externos pueden tratar datos según sus propias políticas.",
    "Para consultas de privacidad o eliminación, escribe a hello@rguide.co.",
  ],
  terms: [
    "RGuide ofrece contenido informativo para planificar viajes. Los precios, horarios, disponibilidad y accesos pueden cambiar.",
    "Las guías y aportaciones deben ser legales, precisas según el conocimiento de quien las envía y respetar derechos de terceros.",
    "RGuide no es responsable de sitios externos, plataformas de reserva, operaciones de negocios ni resultados de viaje.",
    "Para consultas sobre las condiciones, escribe a hello@rguide.co.",
  ],
  "affiliate-disclosure": [
    "RGuide puede recibir una comisión cuando una persona utiliza enlaces de socios para reservar alojamientos, actividades u otros servicios. Esto no cambia el precio pagado.",
    "Las relaciones de afiliación no garantizan presencia, posición ni cobertura positiva.",
    "Antes de reservar, revisa los precios, políticas, disponibilidad y condiciones directamente con el proveedor.",
    "Las preguntas sobre colaboraciones o divulgaciones pueden enviarse a hello@rguide.co.",
  ],
};

export function Footer() {
  const [activeModal, setActiveModal] = useState<FooterModal>(null);
  const pathname = usePathname();
  const isSpanish = pathname === "/es" || pathname.startsWith("/es/");
  const visibleFooterLinks = isSpanish ? spanishFooterLinks : footerLinks;
  const visibleModalTitles = isSpanish ? spanishModalTitles : modalTitles;
  const visibleFaqs = isSpanish ? spanishAboutFaqs : aboutFaqs;
  const visiblePolicyCopy = isSpanish ? spanishPolicyCopy : policyCopy;

  const handleModalLinkClick = (event: MouseEvent<HTMLAnchorElement>, modal: FooterModalId) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
      return;
    }

    event.preventDefault();
    setActiveModal(modal);
  };

  useEffect(() => {
    if (!activeModal) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveModal(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeModal]);

  return (
    <>
      <footer className="border-t border-slate-950/10 bg-[#f3f4f1]/95 lg:mt-2">
        <div className="flex min-h-10 w-full items-center py-2 lg:min-h-[2.375rem] lg:py-0">
          <div className="hidden shrink-0 lg:block lg:w-14" aria-hidden="true" />
          <div className="min-w-0 flex-1 px-3 sm:px-4 lg:px-2">
            <nav
              className="ml-auto flex w-full flex-wrap items-center justify-end gap-x-5 gap-y-2 text-right font-mono text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-500"
              aria-label={isSpanish ? "Información del pie de página" : "Footer information"}
            >
              {visibleFooterLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(event) => handleModalLinkClick(event, link.modal)}
                  className="transition hover:text-slate-950"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </footer>

      {activeModal ? (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/18 px-4 backdrop-blur-sm"
          role="presentation"
          onMouseDown={() => setActiveModal(null)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby={`footer-${activeModal}-title`}
            className="max-h-[82vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-slate-950/10 bg-[#f8f8f4] p-6 text-center shadow-[0_24px_70px_rgba(15,23,42,0.22)]"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <p
              id={`footer-${activeModal}-title`}
              className="font-mono text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-slate-500"
            >
              {visibleModalTitles[activeModal]}
            </p>

            {activeModal === "about" ? (
              <div className="mx-auto mt-4 max-w-md text-left">
                <p className="text-center text-sm leading-6 text-slate-600">
                  {isSpanish
                    ? "RGuide Travel es un índice para planificar viajes con guías urbanas de restaurantes, alojamientos, bares, cultura, naturaleza y actividades organizadas según la forma en que una persona recorre un lugar."
                    : "RGuide Travel is a travel-planning index for opinionated city guides: restaurants, stays, bars, culture, nature, and activities organized around the way people actually move through a place."}
                </p>
                <div className="mt-5 border-t border-slate-950/10 pt-4">
                  <p className="text-center font-mono text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    FAQ
                  </p>
                  <div className="mt-3 space-y-3">
                    {visibleFaqs.map((item) => (
                      <div key={item.question}>
                        <p className="text-sm font-semibold text-slate-900">{item.question}</p>
                        <p className="mt-1 text-sm leading-5 text-slate-600">{item.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : activeModal === "contact" ? (
              <div className="mt-4 flex flex-col items-center gap-3 text-sm text-slate-600">
                {contactLinks.map((link) => (
                  <a key={link.href} href={link.href} className="group hover:text-slate-950">
                    <span>{link.label}</span>
                    <span className="ml-2 text-xs text-slate-400 group-hover:text-slate-500">
                      {isSpanish ? (link.detail === "General" ? "General" : "Editorial") : link.detail}
                    </span>
                  </a>
                ))}
              </div>
            ) : (
              <div className="mx-auto mt-4 max-w-xl space-y-4 text-left text-sm leading-6 text-slate-600">
                {visiblePolicyCopy[activeModal].map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="mt-6 rounded-md border border-slate-950/10 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-slate-950/20 hover:text-slate-950"
            >
              {isSpanish ? "Cerrar" : "Close"}
            </button>
          </section>
        </div>
      ) : null}
    </>
  );
}
