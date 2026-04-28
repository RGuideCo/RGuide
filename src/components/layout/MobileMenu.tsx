"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { useAppStore } from "@/store/app-store";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const currentUser = useAppStore((state) => state.currentUser);
  const openAuthModal = useAppStore((state) => state.openAuthModal);
  const logout = useAppStore((state) => state.logout);
  const navItems = [
    { href: "/submit", label: "Submit" },
    { href: "/favorites", label: "Favorites" },
  ];

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700"
        aria-expanded={open}
        aria-label="Toggle navigation"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>
      {open ? (
        <div className="surface absolute right-0 top-[calc(100%+0.75rem)] z-40 w-72 space-y-3 p-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-stone-100"
            >
              {item.label}
            </Link>
          ))}
          {currentUser ? (
            <button
              type="button"
              onClick={async () => {
                await getSupabaseBrowserClient()?.auth.signOut();
                logout();
                setOpen(false);
              }}
              className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-medium text-slate-700 hover:border-slate-300 hover:text-slate-900"
            >
              Log out
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                openAuthModal("login");
                setOpen(false);
              }}
              className="block w-full rounded-2xl bg-slate-900 px-4 py-3 text-left text-sm font-medium text-white hover:bg-slate-800"
            >
              Log in
            </button>
          )}
        </div>
      ) : null}
    </div>
  );
}
