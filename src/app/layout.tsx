import type { Metadata, Viewport } from "next";
import { Host_Grotesk, Inter } from "next/font/google";
import Script from "next/script";
import type { ReactNode } from "react";

import { Analytics } from "@vercel/analytics/next";
import { SiteAnalyticsEvents } from "@/components/analytics/SiteAnalyticsEvents";
import { AuthInviteRedirect } from "@/components/auth/AuthInviteRedirect";
import { AuthModal } from "@/components/auth/AuthModal";
import { AuthSync } from "@/components/auth/AuthSync";
import { SubmittedGuidesSync } from "@/components/auth/SubmittedGuidesSync";
import { Footer } from "@/components/layout/Footer";
import {
  SITE_ALTERNATE_NAMES,
  SITE_DESCRIPTION,
  SITE_EDITORIAL_EMAIL,
  SITE_EMAIL,
  SITE_KNOWS_ABOUT,
  SITE_SEARCH_NAME,
  SITE_URL,
} from "@/lib/constants";
import { getAbsoluteHref } from "@/lib/routes";
import { serializeJsonForHtml } from "@/lib/serialize-json";

import "material-symbols/rounded.css";
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
  manifest: "/manifest.webmanifest",
  title: {
    default: `${SITE_SEARCH_NAME} | Curated City Travel Guides`,
    template: `%s | ${SITE_SEARCH_NAME}`,
  },
  description: SITE_DESCRIPTION,
  authors: [{ name: SITE_SEARCH_NAME, url: SITE_URL }],
  creator: SITE_SEARCH_NAME,
  publisher: SITE_SEARCH_NAME,
  category: "travel",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${SITE_SEARCH_NAME} | Curated City Travel Guides`,
    description: SITE_DESCRIPTION,
    url: "/",
    siteName: SITE_SEARCH_NAME,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_SEARCH_NAME,
    description: SITE_DESCRIPTION,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black",
    title: "RGuide",
  },
  other: {
    "agd-partner-manual-verification": "",
    "apple-mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#1a1a1a",
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
      inLanguage: "en",
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
      email: SITE_EMAIL,
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "general inquiries",
          email: SITE_EMAIL,
        },
        {
          "@type": "ContactPoint",
          contactType: "editorial corrections",
          email: SITE_EDITORIAL_EMAIL,
        },
      ],
      knowsAbout: SITE_KNOWS_ABOUT,
    },
  ],
};

const STAY22_DEFAULT_LMA_ID = "6a16094744a8f50eb135b857";

const stay22LmaId = process.env.NEXT_PUBLIC_STAY22_LMA_ID?.trim() || STAY22_DEFAULT_LMA_ID;

// Keep the indexable server HTML from painting before the interactive explorer is ready.
const progressiveLoadingCriticalCss = `
  .rguide-progressive-loading{display:none}
  .rguide-js-enabled:not(.rguide-split-screen-ready):not(.rguide-hydration-timeout) .rguide-progressive-shell{min-height:100vh}
  .rguide-js-enabled:not(.rguide-split-screen-ready):not(.rguide-hydration-timeout) .rguide-progressive-fallback{position:absolute;width:1px;height:1px;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);clip-path:inset(50%);white-space:nowrap}
  .rguide-js-enabled:not(.rguide-split-screen-ready):not(.rguide-hydration-timeout) .rguide-progressive-loading{position:fixed;inset:0;z-index:999;display:flex;align-items:center;justify-content:center;gap:14px;background:radial-gradient(circle at 50% 42%,rgba(255,255,255,.1),transparent 34rem),#0f0f0d;color:#fafaf7}
  .rguide-progressive-loading-mark{display:inline-flex;width:44px;height:44px;align-items:center;justify-content:center;border:1px solid rgba(250,250,247,.22);border-radius:50%;background:rgba(250,250,247,.08);color:#f97316;font-size:1rem;font-weight:700;letter-spacing:0}
  .rguide-progressive-loading-copy{display:grid;gap:2px}
  .rguide-progressive-loading-copy span:first-child{color:#fafaf7;font-size:.95rem;font-weight:650}
  .rguide-progressive-loading-copy span:last-child{color:rgba(250,250,247,.62);font-size:.78rem;font-weight:500}
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "document.documentElement.classList.add('rguide-js-enabled');setTimeout(function(){if(document.querySelector('.rguide-progressive-shell')&&!document.documentElement.classList.contains('rguide-split-screen-ready'))document.documentElement.classList.add('rguide-hydration-timeout')},8000);",
          }}
        />
        <style dangerouslySetInnerHTML={{ __html: progressiveLoadingCriticalCss }} />
        <meta name="agd-partner-manual-verification" />
        <link rel="preconnect" href="https://tiles.openfreemap.org" crossOrigin="anonymous" />
        {stay22LmaId ? (
          <>
            <Script
              id="stay22-lma-config"
              strategy="beforeInteractive"
              dangerouslySetInnerHTML={{
                __html: `window.Stay22 = window.Stay22 || {}; window.Stay22.params = { lmaID: ${serializeJsonForHtml(stay22LmaId)} };`,
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
        <AuthInviteRedirect />
        <AuthSync />
        <SubmittedGuidesSync />
        <main>{children}</main>
        <Footer />
        <AuthModal />
        <SiteAnalyticsEvents />
        <Analytics />
        {process.env.NODE_ENV === "production" ? (
          <Script id="rguide-service-worker" strategy="afterInteractive">
            {`if ("serviceWorker" in navigator) { navigator.serviceWorker.register("/sw.js").catch(function () {}); }`}
          </Script>
        ) : null}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonForHtml(websiteJsonLd) }}
        />
      </body>
    </html>
  );
}
