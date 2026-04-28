"use client";

import { X } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { useAppStore } from "@/store/app-store";

export function AuthModal() {
  const { authModalOpen, authMode, closeAuthModal, openAuthModal } = useAppStore();
  const allowPublicSignup = process.env.NEXT_PUBLIC_ALLOW_PUBLIC_SIGNUP === "true";
  const activeAuthMode = allowPublicSignup ? authMode : "login";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const supabase = getSupabaseBrowserClient();

  useEffect(() => {
    setMessage("");
  }, [activeAuthMode]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (!supabase) {
      setMessage("Supabase is not configured yet. Add the project URL and publishable key.");
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
              typeof window !== "undefined" ? window.location.origin : undefined,
          },
        });

        if (error) {
          setMessage(error.message);
          return;
        }

        if (!data.session) {
          setMessage("Check your email to confirm your account, then log in.");
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
        setMessage(error.message);
        return;
      }

      closeAuthModal();
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!authModalOpen) {
    return null;
  }

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
          {authMode === "login" ? "Welcome back" : "Create account"}
        </p>
        <h2 className="mt-3 text-2xl font-semibold text-slate-900">
          {activeAuthMode === "login" ? "Sign in to continue" : "Join RGuide"}
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          {allowPublicSignup
            ? "Sign in with the email and password connected to your RGuide account."
            : "RGuide is invite-only while the first public guides are being tested."}
        </p>

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
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password"
              autoComplete={activeAuthMode === "login" ? "current-password" : "new-password"}
              minLength={6}
              required
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900"
            />
          </label>

          {message ? (
            <p className="rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-800">
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

        {allowPublicSignup ? (
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
