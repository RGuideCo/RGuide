import type { Metadata } from "next";

import { SetPasswordForm } from "@/components/auth/SetPasswordForm";

export const metadata: Metadata = {
  title: "Set Password",
  description: "Finish setting up an invited RGuide account.",
  alternates: {
    canonical: "/auth/set-password",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function SetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <SetPasswordForm />
    </div>
  );
}
