import { MapListCard } from "@/components/cards/MapListCard";
import { getListHref } from "@/lib/routes";
import { MapList } from "@/types";
import Link from "next/link";

interface CategorySectionProps {
  category: string;
  lists: MapList[];
}

export function CategorySection({ category, lists }: CategorySectionProps) {
  if (!lists.length) {
    return null;
  }

  return (
    <section className="space-y-4" id={category.toLowerCase()}>
      <header className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-orange-600">Category</p>
          <h2 className="mt-1 text-xl font-semibold text-slate-900">{category}</h2>
          <p className="mt-2 max-w-3xl text-sm text-slate-600">
            Top {category.toLowerCase()} guides with practical descriptions and linked stops. All items are crawlable in
            the initial HTML response.
          </p>
        </div>
        <p className="text-xs text-slate-600">{lists.length} curated travel guides</p>
      </header>
      <ol className="space-y-4">
        {lists.map((list) => (
          <li key={list.id}>
            <article aria-labelledby={`${list.id}-heading`} className="space-y-2">
              <h3 id={`${list.id}-heading`} className="text-base font-semibold text-slate-900">
                <Link href={getListHref(list)} className="hover:underline">
                  {list.title}
                </Link>
              </h3>
              <p className="text-sm text-slate-600">{list.description}</p>
              <MapListCard list={list} />
            </article>
          </li>
        ))}
      </ol>
    </section>
  );
}
