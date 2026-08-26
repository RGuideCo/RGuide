import { useRef, useState } from "react";

export const MOBILE_ALL_COUNTRIES_VALUE = "__all-countries";
export const MOBILE_ALL_REGIONS_VALUE = "__all-regions";
export const MOBILE_ALL_STATES_VALUE = "__all-states";
export const MOBILE_ALL_CITIES_VALUE = "__all-cities";
export const MOBILE_ALL_NEIGHBORHOODS_VALUE = "__all-neighborhoods";

export type MobileAllSelection = {
  country: boolean;
  region: boolean;
  state: boolean;
  city: boolean;
  neighborhood: boolean;
};

export function useMobileControlsState() {
  const [isDesktopSearchOpen, setIsDesktopSearchOpen] = useState(false);
  const [isMobileExplorerSearchOpen, setIsMobileExplorerSearchOpen] = useState(false);
  const [isMobileListSheetExpanded, setIsMobileListSheetExpanded] = useState(false);
  const [isMobileListSheetDragging, setIsMobileListSheetDragging] = useState(false);
  const [mobileListSheetDragHeight, setMobileListSheetDragHeight] = useState<number | null>(null);
  const mobileListSheetDragHeightRef = useRef<number | null>(null);
  const mobileListSheetDraggingRef = useRef(false);
  const mobileListSheetDragStartRef = useRef({ y: 0, height: 0 });
  const mobileListSheetTapCandidateRef = useRef(false);
  const [mobileAllSelection, setMobileAllSelection] = useState<MobileAllSelection>({
    country: false,
    region: false,
    state: false,
    city: false,
    neighborhood: false,
  });

  return {
    isDesktopSearchOpen,
    setIsDesktopSearchOpen,
    isMobileExplorerSearchOpen,
    setIsMobileExplorerSearchOpen,
    isMobileListSheetExpanded,
    setIsMobileListSheetExpanded,
    isMobileListSheetDragging,
    setIsMobileListSheetDragging,
    mobileListSheetDragHeight,
    setMobileListSheetDragHeight,
    mobileListSheetDragHeightRef,
    mobileListSheetDraggingRef,
    mobileListSheetDragStartRef,
    mobileListSheetTapCandidateRef,
    mobileAllSelection,
    setMobileAllSelection,
  };
}
