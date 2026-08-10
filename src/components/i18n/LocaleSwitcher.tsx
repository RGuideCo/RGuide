"use client";

import { LOCALES, type AppLocale } from "@/lib/i18n/config";

interface LocaleSwitcherProps {
  locale: AppLocale;
}

function getLanguageHref(option: AppLocale) {
  const alternate = document.querySelector<HTMLLinkElement>(
    `link[rel="alternate"][hreflang="${LOCALES[option].hreflang}"]`,
  );
  return alternate?.href ?? (LOCALES[option].pathPrefix || "/");
}

export function LocaleSwitcher({ locale }: LocaleSwitcherProps) {
  return (
    <nav
      aria-label={locale === "es" ? "Idioma" : "Language"}
      className="grid grid-cols-2 gap-1.5 rounded-full border border-white/[0.1] bg-black/20 p-1"
    >
      {(Object.keys(LOCALES) as AppLocale[]).map((option) => {
        const isCurrent = option === locale;
        return (
          <button
            key={option}
            type="button"
            onClick={() => {
              if (isCurrent) return;
              window.localStorage.setItem("rguide-locale", option);
              window.location.assign(getLanguageHref(option));
            }}
            disabled={isCurrent}
            aria-current={isCurrent ? "page" : undefined}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] transition ${
              isCurrent
                ? "profile-light-surface cursor-default shadow-sm"
                : "text-white/[0.58] hover:bg-white/[0.08] hover:text-white"
            }`}
          >
            {LOCALES[option].nativeLabel}
          </button>
        );
      })}
    </nav>
  );
}
