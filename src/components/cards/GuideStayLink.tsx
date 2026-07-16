import { BedDouble, SquareArrowOutUpRight } from "@/components/icons/MaterialSymbol";

export type GuideAffiliateLink = {
  href: string;
  label: string;
  platformLabel: "Agoda" | "Stay22";
};

type GuideStayLinkProps = {
  link: GuideAffiliateLink;
};

export function GuideStayLink({ link }: GuideStayLinkProps) {
  return (
    <div
      className="guide-content-cascade-item relative z-10 mt-3 flex justify-end px-4"
      style={{ animationDelay: "50ms" }}
      onClick={(event) => event.stopPropagation()}
    >
      <a
        href={link.href}
        target="_blank"
        rel="sponsored noopener noreferrer"
        aria-label={`${link.label} via ${link.platformLabel}`}
        className="inline-flex min-h-8 items-center gap-1.5 rounded-md bg-cyan-700 px-2.5 py-1.5 text-xs font-semibold text-white transition hover:bg-cyan-800 focus-visible:ring-2 focus-visible:ring-cyan-700 focus-visible:ring-offset-2"
      >
        <BedDouble className="h-4 w-4" weight={500} />
        <span>{link.label}</span>
        <SquareArrowOutUpRight className="h-3.5 w-3.5 text-cyan-100" weight={500} />
      </a>
    </div>
  );
}
