"use client";

import { X } from "lucide-react";

import { useAppStore } from "@/store/app-store";

export function AuthModal() {
  const { authModalOpen, authMode, closeAuthModal, loginAsMockUser, openAuthModal } =
    useAppStore();

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
          {authMode === "login" ? "Sign in to continue" : "Join RGuide"}
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Front-end demo only. TODO: connect Supabase Auth and secure server actions later.
        </p>

        <form className="mt-6 space-y-4">
          <label className="block text-sm">
            <span className="mb-2 block font-medium text-slate-700">Email</span>
            <input
              type="email"
              placeholder="traveler@example.com"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-2 block font-medium text-slate-700">Password</span>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900"
            />
          </label>

          <button
            type="button"
            onClick={loginAsMockUser}
            className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white hover:bg-slate-800"
          >
            {authMode === "login" ? "Login with mock account" : "Create mock account"}
          </button>
        </form>

        <div className="mt-4 text-sm text-slate-600">
          {authMode === "login" ? "Need an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => openAuthModal(authMode === "login" ? "signup" : "login")}
            className="font-medium text-orange-600 hover:text-orange-700"
          >
            {authMode === "login" ? "Sign up" : "Log in"}
          </button>
        </div>
      </div>
    </div>
  );
}
