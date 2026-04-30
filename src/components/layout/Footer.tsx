import Link from "next/link";

const footerLinks = [
  { href: "/submit", label: "Submit a list" },
  { href: "/favorites", label: "Favorites" },
  { href: "/category/food", label: "Categories" },
];

export function Footer() {
  return (
    <footer className="hidden border-t border-slate-200/80 bg-white/70 lg:block">
      <div className="page-shell flex flex-col gap-6 py-10 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-lg font-semibold text-slate-900">RGuide</p>
          <p className="mt-2 max-w-lg text-sm text-slate-600">
            Curated travel guides for practical trip planning, local discovery, and future travel
            inspiration.
          </p>
        </div>
        <nav className="flex flex-wrap gap-4 text-sm text-slate-600">
          {footerLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-slate-900">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
