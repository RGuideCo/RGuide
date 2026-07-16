import Link from "next/link";

import { ChevronRight } from "@/components/icons/MaterialSymbol";
import type { ListCategory } from "@/types";

export type GuideCrossLink = {
  id: string;
  href: string;
  title: string;
  category: ListCategory;
  context: string;
};

export type GuideCrossLinkGroup = {
  id: string;
  title: string;
  links: GuideCrossLink[];
};

type GuideCrossLinksProps = {
  guideId: string;
  placeName: string;
  groups: GuideCrossLinkGroup[];
  onGuideSelect?: (guideId: string) => void;
};

export function GuideCrossLinks({ guideId, placeName, groups, onGuideSelect }: GuideCrossLinksProps) {
  if (!groups.length) {
    return null;
  }

  return (
    <section
      id={`guide-related-links-${guideId}`}
      data-guide-cross-links
      className="border-t border-slate-200 pt-4"
      aria-labelledby={`guide-related-links-heading-${guideId}`}
      onClick={(event) => event.stopPropagation()}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Keep planning</p>
      <h4
        id={`guide-related-links-heading-${guideId}`}
        className="mt-1 text-base font-semibold leading-6 text-slate-950"
      >
        Continue exploring {placeName}
      </h4>
      <div className="mt-3 grid gap-x-5 gap-y-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        {groups.map((group) => (
          <div key={group.id} className="min-w-0">
            <h5 className="text-xs font-semibold leading-5 text-slate-600">{group.title}</h5>
            <ul className="mt-1 divide-y divide-slate-200 border-y border-slate-200">
              {group.links.map((link) => (
                <li key={link.id}>
                  <Link
                    href={link.href}
                    onClick={(event) => {
                      event.stopPropagation();
                      if (onGuideSelect) {
                        event.preventDefault();
                        onGuideSelect(link.id);
                      }
                    }}
                    className="group flex min-h-14 items-center justify-between gap-3 py-2.5 text-left"
                  >
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold leading-5 text-slate-900 transition group-hover:text-orange-700">
                        {link.title}
                      </span>
                      <span className="mt-0.5 block text-xs leading-4 text-slate-500">{link.context}</span>
                    </span>
                    <ChevronRight
                      className="h-4 w-4 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-orange-700"
                      weight={500}
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
