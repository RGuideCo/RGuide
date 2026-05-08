import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact RGuide",
  description: "Contact RGuide for editorial corrections, partnerships, and general questions.",
};

export default function ContactPage() {
  return (
    <main className="page-shell py-10">
      <section className="surface p-6 sm:p-8" aria-labelledby="contact-heading">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-orange-600">Contact</p>
        <h1 id="contact-heading" className="mt-2 text-4xl font-semibold text-slate-900">
          Contact RGuide
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
          Send general questions, partnership notes, source updates, and correction requests to the
          right inbox below.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {[
            ["General", "hello@rguide.co", "Questions about RGuide, partnerships, and product feedback."],
            ["Editorial", "editorial@rguide.co", "Corrections, source notes, missing places, and guide feedback."],
          ].map(([label, email, description]) => (
            <article key={email} className="rounded-lg border border-slate-950/10 bg-white p-4">
              <h2 className="text-base font-semibold text-slate-950">{label}</h2>
              <a href={`mailto:${email}`} className="mt-2 block text-sm font-medium text-orange-700 hover:text-orange-800">
                {email}
              </a>
              <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
