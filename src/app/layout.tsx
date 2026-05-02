import type { Metadata } from "next";
import type { ReactNode } from "react";

import { Analytics } from "@vercel/analytics/next";
import { AuthModal } from "@/components/auth/AuthModal";
import { AuthSync } from "@/components/auth/AuthSync";
import { SubmittedGuidesSync } from "@/components/auth/SubmittedGuidesSync";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/constants";

import "@/app/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Curated Travel Guides`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthSync />
        <SubmittedGuidesSync />
        <Header />
        <main>{children}</main>
        <Footer />
        <AuthModal />
        <Analytics />
      </body>
    </html>
  );
}
