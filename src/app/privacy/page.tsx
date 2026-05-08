import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "RGuide privacy policy and data handling overview.",
};

export default function PrivacyPage() {
  return (
    <main className="page-shell py-10">
      <article className="surface p-6 sm:p-8" aria-labelledby="privacy-heading">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-orange-600">Privacy</p>
        <h1 id="privacy-heading" className="mt-2 text-4xl font-semibold text-slate-900">
          Privacy Policy
        </h1>
        <div className="mt-6 space-y-5 text-sm leading-7 text-slate-600">
          <p>
            RGuide collects only the information needed to operate the site, improve travel-planning
            features, and respond to messages. If you submit a guide or contact RGuide, the information
            you provide may be used to publish, review, or respond to that request.
          </p>
          <p>
            The site may use analytics and hosting logs to understand page performance, errors, traffic
            patterns, and abuse prevention. These records can include browser, device, referral, and
            approximate location information.
          </p>
          <p>
            RGuide does not sell personal information. Third-party services, including hosting, analytics,
            maps, email, and affiliate partners, may process data according to their own policies when their
            services are used.
          </p>
          <p>
            For privacy questions or deletion requests, email{" "}
            <a href="mailto:hello@rguide.co" className="font-medium text-orange-700 hover:text-orange-800">
              hello@rguide.co
            </a>
            .
          </p>
        </div>
      </article>
    </main>
  );
}
