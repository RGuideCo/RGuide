"use client";

import { Eye, EyeOff, X } from "@/components/icons/MaterialSymbol";
import { FormEvent, useEffect, useState } from "react";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { useAppStore } from "@/store/app-store";

type AuthMessageTone = "error" | "success";

export function AuthModal() {
  const { authModalOpen, authMode, closeAuthModal, openAuthModal } = useAppStore();
  const activeAuthMode = authMode;
  const [isResetPasswordView, setIsResetPasswordView] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [messageTone, setMessageTone] = useState<AuthMessageTone>("error");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const supabase = getSupabaseBrowserClient();

  useEffect(() => {
    setMessage("");
    setMessageTone("error");
    setShowPassword(false);
    setIsResetPasswordView(false);
    setResetEmailSent(false);
  }, [activeAuthMode, authModalOpen]);

  function showMessage(text: string, tone: AuthMessageTone = "error") {
    setMessageTone(tone);
    setMessage(text);
  }

  function openPasswordResetView() {
    setIsResetPasswordView(true);
    setMessage("");
    setMessageTone("error");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (!supabase) {
      showMessage("Supabase is not configured yet. Add the project URL and publishable key.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (activeAuthMode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name.trim() || email.split("@")[0],
            },
            emailRedirectTo:
              typeof window !== "undefined" ? `${window.location.origin}/auth/confirmed` : undefined,
          },
        });

        if (error) {
          showMessage(error.message);
          return;
        }

        if (!data.session) {
          showMessage("Check your email to confirm your account, then log in.", "success");
          return;
        }

        closeAuthModal();
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        showMessage(error.message);
        return;
      }

      closeAuthModal();
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handlePasswordReset(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (!supabase) {
      showMessage("Supabase is not configured yet. Add the project URL and publishable key.");
      return;
    }

    setIsSubmitting(true);

    try {
      const redirectTo =
        typeof window !== "undefined" ? `${window.location.origin}/auth/set-password` : undefined;
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });

      if (error) {
        showMessage(error.message);
        return;
      }

      setResetEmailSent(true);
      showMessage("Check your email for a secure link to set a new password.", "success");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!authModalOpen) {
    return null;
  }

  const eyebrow = isResetPasswordView
    ? "Password reset"
    : activeAuthMode === "login"
      ? "Welcome back"
      : "Create account";
  const title = isResetPasswordView
    ? "Reset your password"
    : activeAuthMode === "login"
      ? "Sign in to continue"
      : "Join RGuide";
  const intro = isResetPasswordView
    ? "Enter the email connected to your RGuide account and we'll send a secure reset link."
    : activeAuthMode === "login"
      ? "Sign in with the email and password connected to your RGuide account."
      : "Create an account to save venues and build your own private guides.";

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-950/40 p-4">
      <div className="surface relative w-full max-w-md p-6">
        <button
          type="button"
          onClick={closeAuthModal}
          className="absolute right-4 top-4 rounded-full p-2 text-slate-500 hover:bg-stone-100 hover:text-slate-900"
          aria-label="Close authentication modal"
        >
          <X className="h-4 w-4" />
        </button>
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-orange-600">
          {eyebrow}
        </p>
        <h2 className="mt-3 text-2xl font-semibold text-slate-900">{title}</h2>
        <p className="mt-2 text-sm text-slate-600">{intro}</p>

        {isResetPasswordView ? (
          <form onSubmit={handlePasswordReset} className="mt-6 space-y-4">
            <label className="block text-sm">
              <span className="mb-2 block font-medium text-slate-700">Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="traveler@example.com"
                autoComplete="email"
                required
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900"
              />
            </label>

            {message ? (
              <p
                className={
                  messageTone === "success"
                    ? "rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
                    : "rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-800"
                }
              >
                {message}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {isSubmitting ? "Sending..." : resetEmailSent ? "Send another link" : "Send reset email"}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsResetPasswordView(false);
                setMessage("");
                setMessageTone("error");
              }}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-stone-100"
            >
              Back to login
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {activeAuthMode === "signup" ? (
              <label className="block text-sm">
                <span className="mb-2 block font-medium text-slate-700">Name</span>
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Your name"
                  autoComplete="name"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900"
                />
              </label>
            ) : null}
            <label className="block text-sm">
              <span className="mb-2 block font-medium text-slate-700">Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="traveler@example.com"
                autoComplete="email"
                required
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-2 block font-medium text-slate-700">Password</span>
              <span className="relative block">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Password"
                  autoComplete={activeAuthMode === "login" ? "current-password" : "new-password"}
                  minLength={8}
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 pr-12 text-slate-900"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-3 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-slate-500 hover:bg-stone-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </span>
            </label>
            {activeAuthMode === "login" ? (
              <div className="-mt-1 text-right">
                <button
                  type="button"
                  onClick={openPasswordResetView}
                  className="rounded-sm text-sm font-medium text-orange-700 underline underline-offset-4 hover:text-orange-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-200"
                >
                  Forgot password?
                </button>
              </div>
            ) : null}

            {message ? (
              <p
                className={
                  messageTone === "success"
                    ? "rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
                    : "rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-800"
                }
              >
                {message}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {isSubmitting
                ? "Working..."
                : activeAuthMode === "login"
                  ? "Log in"
                  : "Create account"}
            </button>
          </form>
        )}

        {!isResetPasswordView ? (
          <div className="mt-4 text-sm text-slate-600">
            {activeAuthMode === "login" ? "Need an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => openAuthModal(activeAuthMode === "login" ? "signup" : "login")}
              className="font-medium text-orange-600 hover:text-orange-700"
            >
              {activeAuthMode === "login" ? "Sign up" : "Log in"}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
