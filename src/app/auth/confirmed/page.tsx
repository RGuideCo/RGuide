import type { Metadata } from "next";

import { AuthConfirmationStatus } from "@/components/auth/AuthConfirmationStatus";

export const metadata: Metadata = {
  title: "Confirm Account",
  description: "Confirm your RGuide account.",
  alternates: {
    canonical: "/auth/confirmed",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function ConfirmedAccountPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <AuthConfirmationStatus />
    </div>
  );
}
