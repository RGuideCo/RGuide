"use client";

import { useEffect, useState } from "react";

type FooterModal = "about" | "contact" | null;

const contactLinks = [
  { href: "mailto:hello@rguide.co", label: "hello@rguide.co", detail: "General" },
  { href: "mailto:editorial@rguide.co", label: "editorial@rguide.co", detail: "Editorial" },
];

const aboutFaqs = [
  {
    question: "What is RGuide?",
    answer:
      "RGuide is a curated travel guide index built around useful city planning: where to eat, stay, go out, explore, and spend time.",
  },
  {
    question: "Who makes the guides?",
    answer:
      "RGuides are editorial guides made by RGuide. User guides can also appear when travelers submit lists, itineraries, or saved recommendations.",
  },
  {
    question: "How are places chosen?",
    answer:
      "Guides are organized by location, category, and planning context, with sources and local signals used to keep each list practical rather than generic.",
  },
  {
    question: "Can I save places for a trip?",
    answer:
      "Yes. You can favorite guides and build itineraries from places inside expanded guides.",
  },
  {
    question: "How do I suggest a correction?",
    answer:
      "Send corrections, source notes, or guide feedback to editorial@rguide.co.",
  },
];

export function Footer() {
  const [activeModal, setActiveModal] = useState<FooterModal>(null);

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
              className="ml-auto flex w-full items-center justify-end gap-5 text-right font-mono text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-500"
              aria-label="Footer information"
            >
              <a
                href="#about"
                onClick={(event) => {
                  event.preventDefault();
                  setActiveModal("about");
                }}
                className="transition hover:text-slate-950"
              >
                About
              </a>
              <a
                href="#contact"
                onClick={(event) => {
                  event.preventDefault();
                  setActiveModal("contact");
                }}
                className="transition hover:text-slate-950"
              >
                Contact
              </a>
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
            className="w-full max-w-lg rounded-lg border border-slate-950/10 bg-[#f8f8f4] p-6 text-center shadow-[0_24px_70px_rgba(15,23,42,0.22)]"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <p
              id={`footer-${activeModal}-title`}
              className="font-mono text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-slate-500"
            >
              {activeModal === "about" ? "About" : "Contact"}
            </p>

            {activeModal === "about" ? (
              <div className="mx-auto mt-4 max-w-md text-left">
                <p className="text-center text-sm leading-6 text-slate-600">
                  RGuide is a travel-planning index for opinionated city guides: restaurants, stays,
                  bars, culture, nature, and activities organized around the way people actually move
                  through a place.
                </p>
                <div className="mt-5 border-t border-slate-950/10 pt-4">
                  <p className="text-center font-mono text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    FAQ
                  </p>
                  <div className="mt-3 space-y-3">
                    {aboutFaqs.map((item) => (
                      <div key={item.question}>
                        <p className="text-sm font-semibold text-slate-900">{item.question}</p>
                        <p className="mt-1 text-sm leading-5 text-slate-600">{item.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-4 flex flex-col items-center gap-3 text-sm text-slate-600">
                {contactLinks.map((link) => (
                  <a key={link.href} href={link.href} className="group hover:text-slate-950">
                    <span>{link.label}</span>
                    <span className="ml-2 text-xs text-slate-400 group-hover:text-slate-500">{link.detail}</span>
                  </a>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="mt-6 rounded-md border border-slate-950/10 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-slate-950/20 hover:text-slate-950"
            >
              Close
            </button>
          </section>
        </div>
      ) : null}
    </>
  );
}
