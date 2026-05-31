import { useRef, useState } from "react";

export const GUIDE_CHROME_WIPE_MS = 420;
export const GUIDE_OPEN_EXPAND_START_MS = 360;
export const GUIDE_LAYOUT_MOTION_MS = 420;
export const GUIDE_LAYOUT_OPEN_TOTAL_MS = 560;
export const GUIDE_LAYOUT_OPEN_SIDEWAYS_OFFSET = 0.58;
export const GUIDE_LAYOUT_CLOSE_VERTICAL_OFFSET = 1 - GUIDE_LAYOUT_OPEN_SIDEWAYS_OFFSET;
export const GUIDE_LAYOUT_CLOSE_TOTAL_MS = 520;
export const GUIDE_COLLAPSE_CONTENT_START_MS = 0;
export const GUIDE_PRE_COLLAPSE_CONTENT_MS = 70;
export const GUIDE_CONTENT_REVEAL_DELAY_MS = GUIDE_OPEN_EXPAND_START_MS + 120;
export const GUIDE_DIRECT_CONTENT_REVEAL_DELAY_MS = 160;

export type ExitingRailIcon =
  | { kind: "continent"; id: string; name: string }
  | { kind: "country"; name: string; flag: string | null }
  | { kind: "state"; id: string; name: string; countryId?: string }
  | { kind: "city"; id: string; name: string; continentId: string; countryId: string };

export type ContinentTitleMorph = {
  kind?: "continent" | "country" | "state" | "city";
  id: string;
  name: string;
  detail: string;
  iconSrc?: string;
  iconFlag?: string;
  fromTop: number;
  fromLeft: number;
  fromWidth: number;
  fromHeight: number;
  fromFontSize: number;
  toTop: number;
  toLeft: number;
  toWidth: number;
  toHeight: number;
  toFontSize: number;
  animate: boolean;
};

export function useSplitScreenAnimationState({
  isProfileShellActive,
  hasCurrentUser,
}: {
  isProfileShellActive: boolean;
  hasCurrentUser: boolean;
}) {
  const [continentLabelRevealKey, setContinentLabelRevealKey] = useState(0);
  const [countryRevealKey, setCountryRevealKey] = useState(0);
  const [continentTitleMorph, setContinentTitleMorph] = useState<ContinentTitleMorph | null>(null);
  const [morphStage, setMorphStage] = useState<"idle" | "grow" | "left" | "settle" | "up">("idle");
  const [postMorphRevealPhase, setPostMorphRevealPhase] = useState<0 | 1 | 2 | 3>(3);
  const [exitingRailIcons, setExitingRailIcons] = useState<Partial<Record<ExitingRailIcon["kind"], ExitingRailIcon>>>({});
  const [profileIntroNonce, setProfileIntroNonce] = useState(0);
  const [displayShellMode, setDisplayShellMode] = useState<"explorer" | "profile">(
    isProfileShellActive && hasCurrentUser ? "profile" : "explorer",
  );
  const [shellTransitionPhase, setShellTransitionPhase] = useState<"idle" | "exiting" | "entering">("idle");

  const guideRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const guideLayoutPositionsRef = useRef<Record<string, DOMRect>>({});
  const guideLayoutTargetIdsRef = useRef<Set<string> | null>(null);
  const shouldAnimateGuideLayoutRef = useRef(false);
  const guideLayoutMotionRef = useRef<"default" | "open" | "close">("default");
  const guideLayoutAnimationFramesRef = useRef<ReturnType<typeof requestAnimationFrame>[]>([]);
  const guideLayoutAnimationsRef = useRef<Animation[]>([]);
  const guideLayoutCleanupTimeoutsRef = useRef<number[]>([]);
  const closingGuideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openingGuideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openingGuideIdRef = useRef<string | null>(null);
  const guideContentRevealTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const guideContentRevealFrameRef = useRef<ReturnType<typeof requestAnimationFrame> | null>(null);
  const initialGuideContentRevealScheduledRef = useRef(false);
  const morphCommitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const morphCleanupTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const morphFrameRef = useRef<ReturnType<typeof requestAnimationFrame> | null>(null);
  const morphStageTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const postMorphRevealTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const shellModeTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const wasProfileModeRef = useRef(false);
  const previousRailIconsRef = useRef<Record<ExitingRailIcon["kind"], ExitingRailIcon | null>>({
    continent: null,
    country: null,
    state: null,
    city: null,
  });
  const shellViewportRef = useRef<HTMLDivElement | null>(null);
  const leftPaneRef = useRef<HTMLDivElement | null>(null);
  const mapViewportPanelRef = useRef<HTMLDivElement | null>(null);
  const rightPaneRef = useRef<HTMLDivElement | null>(null);
  const hoveredGuideMarkerScrollRef = useRef<string | null>(null);
  const guideScrollAnimationFrameRef = useRef<number | null>(null);
  const guideScrollSettleTimeoutRef = useRef<number | null>(null);

  return {
    continentLabelRevealKey,
    setContinentLabelRevealKey,
    countryRevealKey,
    setCountryRevealKey,
    continentTitleMorph,
    setContinentTitleMorph,
    morphStage,
    setMorphStage,
    postMorphRevealPhase,
    setPostMorphRevealPhase,
    exitingRailIcons,
    setExitingRailIcons,
    profileIntroNonce,
    setProfileIntroNonce,
    displayShellMode,
    setDisplayShellMode,
    shellTransitionPhase,
    setShellTransitionPhase,
    guideRefs,
    guideLayoutPositionsRef,
    guideLayoutTargetIdsRef,
    shouldAnimateGuideLayoutRef,
    guideLayoutMotionRef,
    guideLayoutAnimationFramesRef,
    guideLayoutAnimationsRef,
    guideLayoutCleanupTimeoutsRef,
    closingGuideTimeoutRef,
    openingGuideTimeoutRef,
    openingGuideIdRef,
    guideContentRevealTimeoutRef,
    guideContentRevealFrameRef,
    initialGuideContentRevealScheduledRef,
    morphCommitTimeoutRef,
    morphCleanupTimeoutRef,
    morphFrameRef,
    morphStageTimeoutsRef,
    postMorphRevealTimeoutsRef,
    shellModeTimeoutsRef,
    wasProfileModeRef,
    previousRailIconsRef,
    shellViewportRef,
    leftPaneRef,
    mapViewportPanelRef,
    rightPaneRef,
    hoveredGuideMarkerScrollRef,
    guideScrollAnimationFrameRef,
    guideScrollSettleTimeoutRef,
  };
}
