import Link from "next/link";

import { LOCALES, type AppLocale } from "@/lib/i18n/config";

interface LocaleSwitcherProps {
  locale: AppLocale;
  links: Partial<Record<AppLocale, string>>;
}
export function LocaleSwitcher({ locale, links }: LocaleSwitcherProps) {
  return (
    <nav
      aria-label={locale === "es" ? "Idioma" : "Language"}
      className="fixed bottom-4 right-4 z-[700] flex items-center gap-1 rounded-md border border-slate-200 bg-white/95 p-1 text-xs font-semibold shadow-lg backdrop-blur"
    >
      {(Object.keys(LOCALES) as AppLocale[]).map((option) => {
        const href = links[option];
        const isCurrent = option === locale;
        return href ? (
          <Link
            key={option}
            href={href}
            hrefLang={LOCALES[option].hreflang}
            lang={option}
            aria-current={isCurrent ? "page" : undefined}
            className={`rounded px-2.5 py-1.5 ${isCurrent ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"}`}
          >
            {option.toUpperCase()}
          </Link>
        ) : null;
      })}
    </nav>
  );
}
