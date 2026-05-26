import type { Metadata } from "next";
import { Host_Grotesk, Inter } from "next/font/google";
import Script from "next/script";
import type { ReactNode } from "react";

import { Analytics } from "@vercel/analytics/next";
import { AuthModal } from "@/components/auth/AuthModal";
import { AuthSync } from "@/components/auth/AuthSync";
import { SubmittedGuidesSync } from "@/components/auth/SubmittedGuidesSync";
import { Footer } from "@/components/layout/Footer";
import { SITE_ALTERNATE_NAMES, SITE_DESCRIPTION, SITE_NAME, SITE_SEARCH_NAME, SITE_URL } from "@/lib/constants";
import { getAbsoluteHref } from "@/lib/routes";

import "@/app/globals.css";

const hostGrotesk = Host_Grotesk({
  subsets: ["latin"],
  variable: "--font-host-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_SEARCH_NAME,
  title: {
    default: `${SITE_SEARCH_NAME} | Curated City Travel Guides`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_SEARCH_NAME,
  category: "travel",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: SITE_SEARCH_NAME,
    description: SITE_DESCRIPTION,
    url: "/",
    siteName: SITE_SEARCH_NAME,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_SEARCH_NAME,
    description: SITE_DESCRIPTION,
  },
  other: {
    "agd-partner-manual-verification": "",
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": getAbsoluteHref("/#website"),
      name: SITE_SEARCH_NAME,
      alternateName: SITE_ALTERNATE_NAMES,
      url: getAbsoluteHref("/"),
      description: SITE_DESCRIPTION,
      publisher: {
        "@id": getAbsoluteHref("/#organization"),
      },
    },
    {
      "@type": "Organization",
      "@id": getAbsoluteHref("/#organization"),
      name: SITE_SEARCH_NAME,
      alternateName: SITE_ALTERNATE_NAMES,
      url: getAbsoluteHref("/"),
      description: SITE_DESCRIPTION,
    },
  ],
};

const STAY22_DEFAULT_LMA_ID = "6a16094744a8f50eb135b857";

const stay22LmaId = process.env.NEXT_PUBLIC_STAY22_LMA_ID?.trim() || STAY22_DEFAULT_LMA_ID;

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="agd-partner-manual-verification" />
        <link rel="preconnect" href="https://tiles.openfreemap.org" crossOrigin="anonymous" />
        {stay22LmaId ? (
          <>
            <Script
              id="stay22-lma-config"
              strategy="beforeInteractive"
              dangerouslySetInnerHTML={{
                __html: `window.Stay22 = window.Stay22 || {}; window.Stay22.params = { lmaID: ${JSON.stringify(stay22LmaId)} };`,
              }}
            />
            <Script
              id="stay22-lma"
              src="https://scripts.stay22.com/letmeallez.js"
              strategy="beforeInteractive"
            />
          </>
        ) : null}
      </head>
      <body className={`${hostGrotesk.variable} ${inter.variable}`}>
        <AuthSync />
        <SubmittedGuidesSync />
        <main>{children}</main>
        <Footer />
        <AuthModal />
        <Analytics />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </body>
    </html>
  );
}
