import Link from "next/link";

import type { MapList } from "@/types";

type GuideEditorialReviewProps = {
  guide: MapList;
  className?: string;
};

function formatReviewDate(value?: string) {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat("en", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function GuideEditorialReview({ guide, className = "" }: GuideEditorialReviewProps) {
  if (!guide.creator.name.startsWith("R ")) return null;

  const reviewDateValue = guide.updatedAt ?? guide.createdAt;
  const reviewDate = formatReviewDate(reviewDateValue);

  return (
    <p className={`text-xs leading-5 text-slate-500 ${className}`.trim()}>
      Reviewed by{" "}
      <Link href="/about" className="font-semibold text-slate-700 hover:text-orange-700">
        RGuide Editorial
      </Link>
      {reviewDate ? (
        <>
          <span aria-hidden="true"> · </span>
          <span>
            Venue details checked <time dateTime={reviewDateValue}>{reviewDate}</time>
          </span>
        </>
      ) : null}
    </p>
  );
}
