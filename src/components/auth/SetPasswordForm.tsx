"use client";

import { Eye, EyeOff } from "@/components/icons/MaterialSymbol";
import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import type { Session } from "@supabase/supabase-js";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type FormStatus = "checking" | "ready" | "saving" | "done" | "missing";
type PasswordFlow = "invite" | "recovery";

function cleanAuthUrl() {
  if (typeof window === "undefined") {
    return;
  }

  const hasAuthParams =
    window.location.search.includes("code=") ||
    window.location.hash.includes("access_token") ||
    window.location.hash.includes("refresh_token");

  if (hasAuthParams) {
    window.history.replaceState(null, "", window.location.pathname);
  }
}

function getAuthParams() {
  if (typeof window === "undefined") {
    return new URLSearchParams();
  }

  const params = new URLSearchParams(window.location.search);
  const hash = window.location.hash.startsWith("#")
    ? window.location.hash.slice(1)
    : window.location.hash;

  if (hash) {
    const hashParams = new URLSearchParams(hash);
    hashParams.forEach((value, key) => {
      params.set(key, value);
    });
  }

  return params;
}

export function SetPasswordForm() {
  const [status, setStatus] = useState<FormStatus>("checking");
  const [passwordFlow, setPasswordFlow] = useState<PasswordFlow>("invite");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const passwordSetRef = useRef(false);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      setStatus("missing");
      setMessage("Supabase is not configured for this site.");
      return;
    }

    const authClient = supabase;
    let active = true;

    function makeReady(session: Session, flow?: PasswordFlow) {
      if (!active || passwordSetRef.current) {
        return;
      }

      if (flow) {
        setPasswordFlow(flow);
      }

      setEmail(session.user.email ?? "");
      setStatus("ready");
      setMessage("");
      cleanAuthUrl();
    }

    async function resolveInviteSession() {
      const authParams = getAuthParams();
      const accessToken = authParams.get("access_token");
      const refreshToken = authParams.get("refresh_token");
      const code = authParams.get("code");
      const flow: PasswordFlow = authParams.get("type") === "recovery" ? "recovery" : "invite";

      setPasswordFlow(flow);

      if (accessToken && refreshToken) {
        const { data, error } = await authClient.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (data.session) {
          makeReady(data.session, flow);
          return;
        }

        if (error) {
          setMessage(error.message);
        }
      }

      if (code) {
        const { data } = await authClient.auth.exchangeCodeForSession(code);
        if (data.session) {
          makeReady(data.session, flow);
          return;
        }
      }

      for (let attempt = 0; attempt < 4; attempt += 1) {
        const { data, error } = await authClient.auth.getSession();

        if (!active) {
          return;
        }

        if (data.session) {
          makeReady(data.session, flow);
          return;
        }

        if (error) {
          setMessage(error.message);
          break;
        }

        await new Promise((resolve) => window.setTimeout(resolve, 250));
      }

      if (!active || passwordSetRef.current) {
        return;
      }

      setStatus("missing");
      setMessage("This password link is missing or expired. Request a fresh link and open the new email.");
    }

    const {
      data: { subscription },
    } = authClient.auth.onAuthStateChange((event, session) => {
      if (session) {
        makeReady(session, event === "PASSWORD_RECOVERY" ? "recovery" : undefined);
      }
    });

    void resolveInviteSession();

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (password.length < 8) {
      setMessage("Use at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      setStatus("missing");
      setMessage("Supabase is not configured for this site.");
      return;
    }

    setStatus("saving");

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setStatus("ready");
      setMessage(error.message);
      return;
    }

    passwordSetRef.current = true;
    setPassword("");
    setConfirmPassword("");
    setStatus("done");
    setMessage("");
  }

  if (status === "done") {
    return (
      <div className="surface w-full max-w-md p-6">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-orange-600">
          {passwordFlow === "recovery" ? "Password updated" : "Account ready"}
        </p>
        <h1 className="mt-3 text-2xl font-semibold text-slate-900">Your password is set</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          You are signed in{email ? ` as ${email}` : ""}.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white hover:bg-slate-800"
        >
          Continue to RGuide
        </Link>
      </div>
    );
  }

  return (
    <div className="surface w-full max-w-md p-6">
      <p className="text-sm font-medium uppercase tracking-[0.24em] text-orange-600">
        {passwordFlow === "recovery" ? "Password reset" : "Account password"}
      </p>
      <h1 className="mt-3 text-2xl font-semibold text-slate-900">Set your RGuide password</h1>
      <p className="mt-3 text-sm leading-6 text-slate-600">
        {email
          ? passwordFlow === "recovery"
            ? `Choose a new password for ${email}.`
            : `Finish setting up ${email}.`
          : "Choose a secure password for your RGuide account."}
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <label className="block text-sm">
          <span className="mb-2 block font-medium text-slate-700">Password</span>
          <span className="relative block">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password"
              autoComplete="new-password"
              minLength={8}
              required
              disabled={status !== "ready"}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 pr-12 text-slate-900 disabled:cursor-not-allowed disabled:bg-slate-100"
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              disabled={status !== "ready"}
              className="absolute right-3 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-slate-500 hover:bg-stone-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:text-slate-300"
              aria-label={showPassword ? "Hide password" : "Show password"}
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </span>
        </label>

        <label className="block text-sm">
          <span className="mb-2 block font-medium text-slate-700">Confirm password</span>
          <span className="relative block">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Confirm password"
              autoComplete="new-password"
              minLength={8}
              required
              disabled={status !== "ready"}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 pr-12 text-slate-900 disabled:cursor-not-allowed disabled:bg-slate-100"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((current) => !current)}
              disabled={status !== "ready"}
              className="absolute right-3 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-slate-500 hover:bg-stone-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:text-slate-300"
              aria-label={showConfirmPassword ? "Hide password confirmation" : "Show password confirmation"}
              title={showConfirmPassword ? "Hide password confirmation" : "Show password confirmation"}
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </span>
        </label>

        {message ? (
          <p className="rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-800">
            {message}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={status !== "ready"}
          className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {status === "checking" ? "Checking link..." : status === "saving" ? "Saving..." : "Set password"}
        </button>
      </form>
    </div>
  );
}
