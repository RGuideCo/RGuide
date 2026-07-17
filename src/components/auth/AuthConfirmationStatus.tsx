"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type ConfirmationStatus = "checking" | "confirmed" | "missing";

function getAuthParams() {
  const params = new URLSearchParams(window.location.search);
  const hash = window.location.hash.startsWith("#")
    ? window.location.hash.slice(1)
    : window.location.hash;

  if (hash) {
    new URLSearchParams(hash).forEach((value, key) => params.set(key, value));
  }

  return params;
}

function cleanAuthUrl() {
  window.history.replaceState(null, "", window.location.pathname);
}

export function AuthConfirmationStatus() {
  const [status, setStatus] = useState<ConfirmationStatus>("checking");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      setStatus("missing");
      setMessage("Supabase is not configured for this site.");
      return;
    }

    const authClient = supabase;
    let active = true;

    function confirm(session: Session) {
      if (!active) return;
      setEmail(session.user.email ?? "");
      setStatus("confirmed");
      setMessage("");
      cleanAuthUrl();
    }

    async function resolveConfirmation() {
      const params = getAuthParams();
      const accessToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");
      const code = params.get("code");
      const authError = params.get("error_description");

      if (authError) {
        setStatus("missing");
        setMessage(authError);
        cleanAuthUrl();
        return;
      }

      if (accessToken && refreshToken) {
        const { data } = await authClient.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        if (data.session) {
          confirm(data.session);
          return;
        }
      }

      if (code) {
        const { data } = await authClient.auth.exchangeCodeForSession(code);
        if (data.session) {
          confirm(data.session);
          return;
        }
      }

      for (let attempt = 0; attempt < 4; attempt += 1) {
        const { data } = await authClient.auth.getSession();
        if (!active) return;
        if (data.session) {
          confirm(data.session);
          return;
        }
        await new Promise((resolve) => window.setTimeout(resolve, 250));
      }

      if (active) {
        setStatus("missing");
        setMessage("This confirmation link is missing or expired. Sign up again to receive a fresh link.");
      }
    }

    const {
      data: { subscription },
    } = authClient.auth.onAuthStateChange((_event, session) => {
      if (session) confirm(session);
    });

    void resolveConfirmation();

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="surface w-full max-w-md p-6">
      <p className="text-sm font-medium uppercase tracking-[0.24em] text-orange-600">
        {status === "confirmed" ? "Account confirmed" : "Email confirmation"}
      </p>
      <h1 className="mt-3 text-2xl font-semibold text-slate-900">
        {status === "checking"
          ? "Confirming your account"
          : status === "confirmed"
            ? "You are ready to explore"
            : "We could not confirm this link"}
      </h1>
      <p className="mt-3 text-sm leading-6 text-slate-600">
        {status === "checking"
          ? "Checking your secure RGuide link..."
          : status === "confirmed"
            ? `You are signed in${email ? ` as ${email}` : ""}.`
            : message}
      </p>
      <Link
        href="/"
        className={`mt-6 inline-flex w-full items-center justify-center rounded-2xl px-4 py-3 text-sm font-medium ${
          status === "checking"
            ? "pointer-events-none bg-slate-300 text-white"
            : "bg-slate-900 text-white hover:bg-slate-800"
        }`}
        aria-disabled={status === "checking"}
      >
        {status === "confirmed" ? "Continue to RGuide" : "Return to RGuide"}
      </Link>
    </div>
  );
}
