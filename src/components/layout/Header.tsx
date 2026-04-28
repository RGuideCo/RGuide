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
  const [isModeIconHovered, setIsModeIconHovered] = useState(false);
  const [globeGifKey, setGlobeGifKey] = useState(0);
  const [frozenGlobeSrc, setFrozenGlobeSrc] = useState("/assets/rotating-earth-still.png");
  const [videoFallback, setVideoFallback] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const globeVideoRef = useRef<HTMLVideoElement | null>(null);
  const globeGifRef = useRef<HTMLImageElement | null>(null);
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

  return (
    <header className="relative z-30 bg-stone-50">
      <div className="flex w-full flex-wrap items-center gap-x-3 gap-y-2 px-3 py-3 sm:px-4 lg:flex-nowrap lg:gap-0 lg:px-0 lg:py-3">
        {isMobileSearchOpen ? (
          <div className="absolute inset-0 z-40 flex items-center gap-2 bg-stone-50/95 px-3 backdrop-blur lg:hidden">
            <SearchBar
              autoFocus
              onResultSelect={() => setIsMobileSearchOpen(false)}
              className="max-w-none flex-1"
            />
            <button
              type="button"
              onClick={() => setIsMobileSearchOpen(false)}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm"
              aria-label="Close search"
              title="Close search"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        ) : null}
        <div className="w-auto shrink-0 lg:w-14 lg:translate-x-3">
          <Link href="/" onClick={() => setProfileShellActive(false)} className="shrink-0">
            <span className="text-xl font-semibold tracking-tight text-slate-950">RGuide</span>
          </Link>
        </div>

        <div className="hidden min-w-0 lg:block lg:flex-1">
          <div className="mx-auto w-full max-w-[1600px] px-1 sm:px-2 lg:px-2">
            <div className="grid items-center lg:grid-cols-[minmax(280px,0.66fr)_minmax(0,1.14fr)_minmax(576px,1.2fr)]">
              <div className="hidden lg:block" />
              <div className="hidden lg:block" />
              <SearchBar className="ml-auto w-full lg:max-w-none" />
            </div>
          </div>
        </div>

        <div className="ml-auto flex shrink-0 items-center justify-center gap-2 lg:ml-0 lg:w-14 lg:-translate-x-1">
          <button
            type="button"
            onClick={() => setIsMobileSearchOpen(true)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm lg:hidden"
            aria-label="Open search"
            title="Search"
          >
            <Search className="h-5 w-5" />
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
              className="inline-flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white text-slate-700"
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
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700"
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
