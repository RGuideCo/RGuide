"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { CATEGORIES } from "@/lib/constants";

interface CityToolbarProps {
  activeSort: string;
  activeCategory?: string;
}

export function CityToolbar({ activeSort, activeCategory }: CityToolbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateQuery = (next: { sort?: string; category?: string }) => {
    const params = new URLSearchParams(searchParams.toString());

    if (next.sort !== undefined) {
      if (!next.sort || next.sort === "newest") {
        params.delete("sort");
      } else {
        params.set("sort", next.sort);
      }
    }

    if (next.category !== undefined) {
      if (!next.category) {
        params.delete("category");
      } else {
        params.set("category", next.category);
      }
    }

    router.replace(params.toString() ? `${pathname}?${params.toString()}` : pathname);
  };

  return (
    <>
      <div className="flex flex-wrap gap-3">
        <label className="text-sm text-slate-700">
          <span className="mb-1.5 block text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
            Sort
          </span>
          <select
            value={activeSort}
            onChange={(event) => updateQuery({ sort: event.target.value })}
            className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm"
            name="sort"
          >
            <option value="newest">Newest</option>
            <option value="most-popular">Most popular</option>
            <option value="most-upvoted">Most upvoted</option>
          </select>
        </label>
      </div>
      <div className="mt-3 border-t border-slate-200 pt-3">
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
          Filter by category
        </p>
        <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((category) => {
          const value = category.toLowerCase();

          return (
            <button
              key={category}
              type="button"
              onClick={() => updateQuery({ category: value })}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium ${activeCategory === value ? "border-orange-500 bg-orange-500 text-white" : "border-slate-200 bg-white text-slate-700"}`}
            >
              {category}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => updateQuery({ category: "" })}
          className="rounded-full border border-slate-200 bg-stone-100 px-3 py-1.5 text-xs font-medium text-slate-700"
        >
          All
        </button>
        </div>
      </div>
    </>
  );
}
