import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sign-in Error",
  description: "Return to RGuide and try signing in again.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AuthErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="surface w-full max-w-md p-6">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-orange-600">
          Sign-in interrupted
        </p>
        <h1 className="mt-3 text-2xl font-semibold text-slate-900">
          We could not finish signing you in
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Return to RGuide and try Google again, or sign in with your email and password.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white hover:bg-slate-800"
        >
          Return to RGuide
        </Link>
      </div>
    </div>
  );
}
