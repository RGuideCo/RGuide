"use client";

import Link from "next/link";
import { Search, UserRound, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { SearchBar } from "@/components/shared/SearchBar";
import { useAppStore } from "@/store/app-store";

export function Header() {
  const useVideoGlobe = true;
  const currentUser = useAppStore((state) => state.currentUser);
  const isProfileShellActive = useAppStore((state) => state.isProfileShellActive);
  const openAuthModal = useAppStore((state) => state.openAuthModal);
  const setProfileShellActive = useAppStore((state) => state.setProfileShellActive);
  const isMobileSearchOpen = useAppStore((state) => state.isMobileSearchOpen);
  const setMobileSearchOpen = useAppStore((state) => state.setMobileSearchOpen);
  const [isModeIconHovered, setIsModeIconHovered] = useState(false);
  const [globeGifKey, setGlobeGifKey] = useState(0);
  const [frozenGlobeSrc, setFrozenGlobeSrc] = useState("/assets/rotating-earth-still.png");
  const [videoFallback, setVideoFallback] = useState(false);
  const [isMobileSearchClosing, setIsMobileSearchClosing] = useState(false);
  const globeVideoRef = useRef<HTMLVideoElement | null>(null);
  const globeGifRef = useRef<HTMLImageElement | null>(null);
  const mobileSearchCloseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMobileSearchVisible = isMobileSearchOpen || isMobileSearchClosing;
  const closeMobileSearch = () => {
    if (!isMobileSearchOpen && !isMobileSearchClosing) {
      return;
    }
    if (mobileSearchCloseTimeoutRef.current) {
      clearTimeout(mobileSearchCloseTimeoutRef.current);
    }
    setMobileSearchOpen(false);
    setIsMobileSearchClosing(true);
    mobileSearchCloseTimeoutRef.current = setTimeout(() => {
      setIsMobileSearchClosing(false);
      mobileSearchCloseTimeoutRef.current = null;
    }, 260);
  };
  const openMobileSearch = () => {
    if (mobileSearchCloseTimeoutRef.current) {
      clearTimeout(mobileSearchCloseTimeoutRef.current);
      mobileSearchCloseTimeoutRef.current = null;
    }
    setIsMobileSearchClosing(false);
    setMobileSearchOpen(true);
  };
  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const video = globeVideoRef.current;
      if (!video) {
        setVideoFallback(true);
        return;
      }
      if (video.readyState === 0) {
        setVideoFallback(true);
      }
    }, 450);
    return () => window.clearTimeout(timeoutId);
  }, []);
  useEffect(() => {
    return () => {
      if (mobileSearchCloseTimeoutRef.current) {
        clearTimeout(mobileSearchCloseTimeoutRef.current);
      }
    };
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-transparent lg:relative lg:inset-auto lg:z-30 lg:border-b lg:border-slate-950/10 lg:bg-[#f3f4f1]/95">
      <div className="flex w-full flex-wrap items-center gap-x-3 gap-y-2 px-3 py-3 sm:px-4 lg:flex-nowrap lg:gap-0 lg:px-0 lg:py-3">
        <div
          className={`absolute right-3 top-3 z-40 flex items-center gap-2 transition-[width,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] lg:hidden ${
            isMobileSearchVisible ? "w-[calc(100vw-4.5rem)] opacity-100" : "pointer-events-none w-8 opacity-0"
          }`}
        >
          {isMobileSearchVisible ? (
            <>
            <SearchBar
              autoFocus
              onResultSelect={closeMobileSearch}
              compact
              className={`max-w-none flex-1 transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isMobileSearchOpen ? "translate-x-0 opacity-100" : "translate-x-5 opacity-0"
              }`}
            />
            <button
              type="button"
              onClick={closeMobileSearch}
              className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isMobileSearchOpen ? "scale-100 opacity-100" : "scale-75 opacity-0"
              }`}
              aria-label="Close search"
              title="Close search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
            </>
          ) : null}
        </div>
        <div className="absolute left-3 top-3 w-auto shrink-0 drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)] lg:static lg:w-14 lg:translate-x-3 lg:drop-shadow-none">
          <Link href="/" onClick={() => setProfileShellActive(false)} className="shrink-0">
            <span className="hidden font-mono text-[1.05rem] font-semibold uppercase tracking-[0.16em] text-slate-950 lg:inline">RGuide</span>
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-950 font-mono text-sm font-semibold text-white shadow-sm lg:hidden">
              R
            </span>
          </Link>
        </div>

        <div className="hidden min-w-0 lg:block lg:flex-1">
          <div className="w-full px-1 sm:px-2 lg:px-2">
            <div className="grid items-center lg:grid-cols-[minmax(280px,0.66fr)_minmax(0,1.14fr)_minmax(576px,1.2fr)]">
              <div className="hidden lg:block" />
              <div className="hidden lg:block" />
              <SearchBar className="ml-auto" />
            </div>
          </div>
        </div>

        <div className="ml-auto flex shrink-0 items-center justify-center gap-2 lg:ml-0 lg:w-14 lg:-translate-x-1">
          <button
            type="button"
            onClick={openMobileSearch}
            className={`inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition-opacity lg:hidden ${
              isMobileSearchVisible ? "pointer-events-none opacity-0" : "opacity-100"
            }`}
            aria-label="Open search"
            title="Search"
          >
            <Search className="h-4 w-4" />
          </button>
          {currentUser ? (
            <button
              type="button"
              onClick={() => setProfileShellActive(!isProfileShellActive)}
              onPointerEnter={() => {
                const video = globeVideoRef.current;
                if (useVideoGlobe && !videoFallback && video && video.readyState > 0) {
                  void video.play().catch(() => {
                    setVideoFallback(true);
                  });
                } else {
                  if (useVideoGlobe) {
                    setVideoFallback(true);
                  }
                  setGlobeGifKey((current) => current + 1);
                }
                setIsModeIconHovered(true);
              }}
              onPointerLeave={() => {
                if (useVideoGlobe && !videoFallback) {
                  globeVideoRef.current?.pause();
                } else {
                  const gif = globeGifRef.current;
                  if (gif && gif.complete && gif.naturalWidth > 0 && gif.naturalHeight > 0) {
                    const canvas = document.createElement("canvas");
                    canvas.width = gif.naturalWidth;
                    canvas.height = gif.naturalHeight;
                    const context = canvas.getContext("2d");
                    if (context) {
                      context.drawImage(gif, 0, 0, canvas.width, canvas.height);
                      setFrozenGlobeSrc(canvas.toDataURL("image/png"));
                    }
                  }
                }
                setIsModeIconHovered(false);
              }}
              onBlur={() => {
                if (useVideoGlobe && !videoFallback) {
                  globeVideoRef.current?.pause();
                } else {
                  const gif = globeGifRef.current;
                  if (gif && gif.complete && gif.naturalWidth > 0 && gif.naturalHeight > 0) {
                    const canvas = document.createElement("canvas");
                    canvas.width = gif.naturalWidth;
                    canvas.height = gif.naturalHeight;
                    const context = canvas.getContext("2d");
                    if (context) {
                      context.drawImage(gif, 0, 0, canvas.width, canvas.height);
                      setFrozenGlobeSrc(canvas.toDataURL("image/png"));
                    }
                  }
                }
                setIsModeIconHovered(false);
              }}
              className="hidden h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white text-slate-700 lg:inline-flex lg:h-11 lg:w-11"
              aria-label={isProfileShellActive ? "Return to explorer mode" : "Open profile mode"}
              title={isProfileShellActive ? "Return to explorer" : "Open profile"}
            >
              <span className="header-mode-flip-wrap h-full w-full">
                <span className={`header-mode-flip-card ${isProfileShellActive ? "is-profile" : ""}`}>
                  <span className="header-mode-flip-face overflow-hidden rounded-full">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="h-full w-full object-cover"
                    />
                  </span>
                  <span className="header-mode-flip-face header-mode-flip-back overflow-hidden rounded-full">
                    {useVideoGlobe && !videoFallback ? (
                      <video
                        ref={globeVideoRef}
                        muted
                        loop
                        playsInline
                        preload="auto"
                        poster="/assets/rotating-earth-still.png"
                        className="h-full w-full object-cover"
                        onError={() => setVideoFallback(true)}
                      >
                        <source src="/assets/rotating-earth.webm" type="video/webm" />
                        <source src="/assets/rotating-earth.mp4" type="video/mp4" />
                      </video>
                    ) : (
                      <img
                        ref={isModeIconHovered ? globeGifRef : null}
                        key={`header-globe-${globeGifKey}`}
                        src={isModeIconHovered ? "/assets/rotating-earth.gif" : frozenGlobeSrc}
                        alt=""
                        aria-hidden="true"
                        className="h-full w-full object-cover"
                      />
                    )}
                  </span>
                </span>
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => openAuthModal("login")}
              className="hidden h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 lg:inline-flex lg:h-11 lg:w-11"
              aria-label="Log in"
              title="Log in"
            >
              <UserRound className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
