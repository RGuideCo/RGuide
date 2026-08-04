import Link from "next/link";

import type { AppLocale } from "@/lib/i18n/config";
import type { MapList } from "@/types";

type GuideEditorialReviewProps = {
  guide: MapList;
  locale?: AppLocale;
  className?: string;
};

function formatReviewDate(value: string | undefined, locale: AppLocale) {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat(locale === "es" ? "es" : "en", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function GuideEditorialReview({ guide, locale = "en", className = "" }: GuideEditorialReviewProps) {
  if (!guide.creator.name.startsWith("R ")) return null;

  const reviewDateValue = guide.updatedAt ?? guide.createdAt;
  const reviewDate = formatReviewDate(reviewDateValue, locale);
  const aboutHref = locale === "es" ? "/es/acerca-de" : "/about";

  return (
    <p className={`text-xs leading-5 text-slate-500 ${className}`.trim()}>
      {locale === "es" ? "Revisado por" : "Reviewed by"}{" "}
      <Link href={aboutHref} className="font-semibold text-slate-700 hover:text-orange-700">
        RGuide Editorial
      </Link>
      {reviewDate ? (
        <>
          <span aria-hidden="true"> · </span>
          <span>
            {locale === "es" ? "Datos de los lugares comprobados en" : "Venue details checked"}{" "}
            <time dateTime={reviewDateValue}>{reviewDate}</time>
          </span>
        </>
      ) : null}
    </p>
  );
}
