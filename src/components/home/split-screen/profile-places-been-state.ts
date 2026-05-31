import { useRef, useState } from "react";

import { usePersistedPlacesBeen } from "@/components/home/use-persisted-places-been";
import {
  PlacesBeenFilter,
  profileLeftRailOptions,
  profileRightRailOptions,
} from "@/components/home/split-screen-config";
import type { MapList, SelectionState, SubmissionType, User } from "@/types";

export function useProfilePlacesBeenState(currentUser: User | null) {
  const [activeProfileLeftRail, setActiveProfileLeftRail] = useState<
    (typeof profileLeftRailOptions)[number]["id"] | null
  >(null);
  const [activePlacesBeenFilter, setActivePlacesBeenFilter] = useState<PlacesBeenFilter>("places");
  const {
    manualPlacesBeenCountries,
    setManualPlacesBeenCountries,
    manualPlacesBeenCities,
    setManualPlacesBeenCities,
    manualPlacesBeenPlaces,
    setManualPlacesBeenPlaces,
  } = usePersistedPlacesBeen(currentUser);
  const [isAddingPlacesBeenCountry, setIsAddingPlacesBeenCountry] = useState(false);
  const [draftPlacesBeenCountry, setDraftPlacesBeenCountry] = useState("");
  const [expandedPlacesBeenCountries, setExpandedPlacesBeenCountries] = useState<string[]>([]);
  const [focusedPlacesBeenStopIds, setFocusedPlacesBeenStopIds] = useState<string[] | null>(null);
  const [profilePlacesBeenMapSelection, setProfilePlacesBeenMapSelection] = useState<SelectionState | null>(null);
  const [activeProfileRightRail, setActiveProfileRightRail] = useState<(typeof profileRightRailOptions)[number]["id"]>("guides");
  const [profileExpandedGuideId, setProfileExpandedGuideId] = useState<string | null>(null);
  const [isProfileSubmitting, setIsProfileSubmitting] = useState(false);
  const [profileEditingListId, setProfileEditingListId] = useState<string | null>(null);
  const [profileSubmissionType, setProfileSubmissionType] = useState<SubmissionType>("guide");
  const [profileGuideSubmissionVariant, setProfileGuideSubmissionVariant] = useState<"guide" | "itinerary">("guide");
  const [profileSubmissionSelection, setProfileSubmissionSelection] = useState<SelectionState>({});
  const [profileSubmissionPreviewList, setProfileSubmissionPreviewList] = useState<MapList | null>(null);
  const [profileMapPinnedLocation, setProfileMapPinnedLocation] = useState<{
    id: number;
    coordinates: [number, number];
  } | null>(null);
  const [profileNameDraft, setProfileNameDraft] = useState("");
  const [profileBioDraft, setProfileBioDraft] = useState("");
  const [profileAvatarPreview, setProfileAvatarPreview] = useState("");
  const [profileAvatarFile, setProfileAvatarFile] = useState<File | null>(null);
  const [profileEditMessage, setProfileEditMessage] = useState<string | null>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const profileAvatarInputRef = useRef<HTMLInputElement | null>(null);
  const previousProfileLeftRailRef = useRef<(typeof profileLeftRailOptions)[number]["id"] | null>(null);

  return {
    activeProfileLeftRail,
    setActiveProfileLeftRail,
    activePlacesBeenFilter,
    setActivePlacesBeenFilter,
    manualPlacesBeenCountries,
    setManualPlacesBeenCountries,
    manualPlacesBeenCities,
    setManualPlacesBeenCities,
    manualPlacesBeenPlaces,
    setManualPlacesBeenPlaces,
    isAddingPlacesBeenCountry,
    setIsAddingPlacesBeenCountry,
    draftPlacesBeenCountry,
    setDraftPlacesBeenCountry,
    expandedPlacesBeenCountries,
    setExpandedPlacesBeenCountries,
    focusedPlacesBeenStopIds,
    setFocusedPlacesBeenStopIds,
    profilePlacesBeenMapSelection,
    setProfilePlacesBeenMapSelection,
    activeProfileRightRail,
    setActiveProfileRightRail,
    profileExpandedGuideId,
    setProfileExpandedGuideId,
    isProfileSubmitting,
    setIsProfileSubmitting,
    profileEditingListId,
    setProfileEditingListId,
    profileSubmissionType,
    setProfileSubmissionType,
    profileGuideSubmissionVariant,
    setProfileGuideSubmissionVariant,
    profileSubmissionSelection,
    setProfileSubmissionSelection,
    profileSubmissionPreviewList,
    setProfileSubmissionPreviewList,
    profileMapPinnedLocation,
    setProfileMapPinnedLocation,
    profileNameDraft,
    setProfileNameDraft,
    profileBioDraft,
    setProfileBioDraft,
    profileAvatarPreview,
    setProfileAvatarPreview,
    profileAvatarFile,
    setProfileAvatarFile,
    profileEditMessage,
    setProfileEditMessage,
    isSavingProfile,
    setIsSavingProfile,
    profileAvatarInputRef,
    previousProfileLeftRailRef,
  };
}
