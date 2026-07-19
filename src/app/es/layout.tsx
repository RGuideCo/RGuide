import type { Metadata } from "next";
import type { ReactNode } from "react";

import { DICTIONARIES } from "@/lib/i18n/dictionaries";

export const metadata: Metadata = {
  title: {
    default: "RGuide | Guías de viaje urbanas seleccionadas",
    template: "%s | RGuide",
  },
  description: DICTIONARIES.es.siteDescription,
  openGraph: {
    locale: "es_ES",
    siteName: "RGuide",
  },
};

export default function SpanishLayout({ children }: { children: ReactNode }) {
  return (
    <div lang="es" dir="ltr">
      <script
        dangerouslySetInnerHTML={{
          __html: "document.documentElement.lang='es';document.documentElement.dir='ltr';",
        }}
      />
      {children}
    </div>
  );
}
