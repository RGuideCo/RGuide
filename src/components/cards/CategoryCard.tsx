import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { getCategoryHref } from "@/lib/routes";
import { ListCategory } from "@/types";

interface CategoryCardProps {
  category: ListCategory;
  count: number;
}

export function CategoryCard({ category, count }: CategoryCardProps) {
  return (
    <Link
      href={getCategoryHref(category)}
      className="surface flex items-center justify-between gap-4 p-5 hover:-translate-y-0.5"
    >
      <div>
        <p className="text-lg font-semibold text-slate-900">{category}</p>
        <p className="mt-1 text-sm text-slate-600">{count} curated map lists</p>
      </div>
      <ArrowRight className="h-5 w-5 text-slate-400" />
    </Link>
  );
}
