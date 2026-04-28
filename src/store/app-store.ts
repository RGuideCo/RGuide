"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import { mapLists } from "@/data";
import { slugify } from "@/lib/utils";
import {
  deleteSubmittedGuide,
  saveSubmittedGuide,
} from "@/lib/supabase/submitted-guides";
import { MapList, SubmissionType, User } from "@/types";

type AuthMode = "login" | "signup";
const DEFAULT_ITINERARY_PLAYLIST_ID = "itinerary-primary";

interface SubmitInput {
  submissionType: SubmissionType;
  url: string;
  title: string;
  description: string;
  category: MapList["category"];
  continent: string;
  country: string;
  city?: string;
  neighborhood?: string;
  visitedAt?: string;
  journalNote?: string;
  stops?: MapList["stops"];
}

export interface ItineraryPlaylist {
  id: string;
  name: string;
  listIds: string[];
  stopKeys: string[];
  completedListId?: string;
  createdAt: string;
}

interface PlacesBeenEntries {
  countries: string[];
  cities: string[];
  places: string[];
}

interface AppState {
  currentUser: User | null;
  isProfileShellActive: boolean;
  isMobileSearchOpen: boolean;
  authModalOpen: boolean;
  authMode: AuthMode;
  favoriteIds: string[];
  votedIds: string[];
  itineraryIds: string[];
  itineraryStopIds: string[];
  itineraryStopScheduleById: Record<string, { date?: string; time?: string }>;
  itineraryPlaylists: ItineraryPlaylist[];
  placesBeenByUserId: Record<string, PlacesBeenEntries>;
  submittedLists: MapList[];
  openAuthModal: (mode?: AuthMode) => void;
  setCurrentUser: (user: User | null) => void;
  setSubmittedLists: (lists: MapList[]) => void;
  setProfileShellActive: (active: boolean) => void;
  setMobileSearchOpen: (active: boolean) => void;
  closeAuthModal: () => void;
  logout: () => void;
  requireAuth: (callback?: () => void) => void;
  toggleFavorite: (listId: string) => void;
  toggleUpvote: (listId: string) => void;
  toggleItinerary: (listId: string) => void;
  toggleItineraryStop: (stopKey: string) => void;
  setItineraryStopSchedule: (stopKey: string, schedule: { date?: string; time?: string }) => void;
  createItineraryPlaylist: (name: string) => { ok: boolean; message: string; playlist?: ItineraryPlaylist };
  addListToItineraryPlaylist: (playlistId: string, listId: string) => void;
  addStopToItineraryPlaylist: (playlistId: string, stopKey: string) => void;
  setItineraryPlaylistCompleted: (playlistId: string, listId: string) => void;
  removeListFromItineraryPlaylist: (playlistId: string, listId: string) => void;
  removeStopFromItineraryPlaylist: (playlistId: string, stopKey: string) => void;
  setPlacesBeenForUser: (userId: string, entries: Partial<PlacesBeenEntries>) => void;
  submitList: (input: SubmitInput) => { ok: boolean; message: string; list?: MapList };
  updateSubmittedList: (listId: string, input: SubmitInput) => { ok: boolean; message: string; list?: MapList };
  deleteSubmittedList: (listId: string) => { ok: boolean; message: string };
  setJournalVisibility: (listId: string, visibility: "public" | "private") => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      isProfileShellActive: false,
      isMobileSearchOpen: false,
      authModalOpen: false,
      authMode: "login",
      favoriteIds: [],
      votedIds: [],
      itineraryIds: [],
      itineraryStopIds: [],
      itineraryStopScheduleById: {},
      itineraryPlaylists: [
        {
          id: DEFAULT_ITINERARY_PLAYLIST_ID,
          name: "My Itinerary",
          listIds: [],
          stopKeys: [],
          completedListId: undefined,
          createdAt: new Date().toISOString(),
        },
      ],
      placesBeenByUserId: {},
      submittedLists: [],
      openAuthModal: (mode = "login") =>
        set({
          authModalOpen: true,
          authMode: mode,
        }),
      setCurrentUser: (user) => set({ currentUser: user }),
      setSubmittedLists: (lists) => set({ submittedLists: lists }),
      setProfileShellActive: (active) => set({ isProfileShellActive: active }),
      setMobileSearchOpen: (active) => set({ isMobileSearchOpen: active }),
      closeAuthModal: () => set({ authModalOpen: false }),
      logout: () => set({ currentUser: null }),
      requireAuth: (callback) => {
        const { currentUser, openAuthModal } = get();

        if (!currentUser) {
          openAuthModal("login");
          return;
        }

        callback?.();
      },
      toggleFavorite: (listId) =>
        set((state) => ({
          favoriteIds: state.favoriteIds.includes(listId)
            ? state.favoriteIds.filter((id) => id !== listId)
            : [...state.favoriteIds, listId],
        })),
      toggleUpvote: (listId) => {
        get().requireAuth(() =>
          set((state) => ({
            votedIds: state.votedIds.includes(listId)
              ? state.votedIds.filter((id) => id !== listId)
              : [...state.votedIds, listId],
          })),
        );
      },
      toggleItinerary: (listId) =>
        get().requireAuth(() =>
          set((state) => ({
            itineraryIds: state.itineraryIds.includes(listId)
              ? state.itineraryIds.filter((id) => id !== listId)
              : [...state.itineraryIds, listId],
            itineraryPlaylists: state.itineraryPlaylists.map((playlist) =>
              playlist.id === DEFAULT_ITINERARY_PLAYLIST_ID
                ? {
                    ...playlist,
                    listIds: playlist.listIds.includes(listId)
                      ? playlist.listIds.filter((id) => id !== listId)
                      : [...playlist.listIds, listId],
                  }
                : playlist,
            ),
          })),
        ),
      toggleItineraryStop: (stopKey) =>
        get().requireAuth(() =>
          set((state) => ({
            itineraryStopIds: state.itineraryStopIds.includes(stopKey)
              ? state.itineraryStopIds.filter((id) => id !== stopKey)
              : [...state.itineraryStopIds, stopKey],
            itineraryStopScheduleById: state.itineraryStopIds.includes(stopKey)
              ? Object.fromEntries(
                  Object.entries(state.itineraryStopScheduleById).filter(([key]) => key !== stopKey),
                )
              : state.itineraryStopScheduleById,
            itineraryPlaylists: state.itineraryPlaylists.map((playlist) =>
              playlist.id === DEFAULT_ITINERARY_PLAYLIST_ID
                ? {
                    ...playlist,
                    stopKeys: playlist.stopKeys.includes(stopKey)
                      ? playlist.stopKeys.filter((key) => key !== stopKey)
                      : [...playlist.stopKeys, stopKey],
                  }
                : playlist,
            ),
          })),
        ),
      setItineraryStopSchedule: (stopKey, schedule) =>
        get().requireAuth(() =>
          set((state) => ({
            itineraryStopScheduleById: {
              ...state.itineraryStopScheduleById,
              [stopKey]: {
                ...state.itineraryStopScheduleById[stopKey],
                ...schedule,
              },
            },
          })),
        ),
      createItineraryPlaylist: (name) => {
        const trimmed = name.trim();
        if (!trimmed) {
          return { ok: false, message: "Enter an itinerary name." };
        }

        const nextPlaylist: ItineraryPlaylist = {
          id: `itinerary-${Date.now()}`,
          name: trimmed,
          listIds: [],
          stopKeys: [],
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          itineraryPlaylists: [nextPlaylist, ...state.itineraryPlaylists],
        }));

        return { ok: true, message: "Itinerary created.", playlist: nextPlaylist };
      },
      addListToItineraryPlaylist: (playlistId, listId) =>
        get().requireAuth(() =>
          set((state) => ({
            itineraryIds: state.itineraryIds.includes(listId)
              ? state.itineraryIds
              : [...state.itineraryIds, listId],
            itineraryPlaylists: state.itineraryPlaylists.map((playlist) =>
              playlist.id === playlistId
                ? {
                    ...playlist,
                    listIds: playlist.listIds.includes(listId)
                      ? playlist.listIds
                      : [...playlist.listIds, listId],
                  }
                : playlist,
            ),
          })),
        ),
      addStopToItineraryPlaylist: (playlistId, stopKey) =>
        get().requireAuth(() =>
          set((state) => ({
            itineraryStopIds: state.itineraryStopIds.includes(stopKey)
              ? state.itineraryStopIds
              : [...state.itineraryStopIds, stopKey],
            itineraryPlaylists: state.itineraryPlaylists.map((playlist) =>
              playlist.id === playlistId
                ? {
                    ...playlist,
                    stopKeys: playlist.stopKeys.includes(stopKey)
                      ? playlist.stopKeys
                      : [...playlist.stopKeys, stopKey],
                  }
                : playlist,
            ),
          })),
        ),
      setItineraryPlaylistCompleted: (playlistId, listId) =>
        get().requireAuth(() =>
          set((state) => ({
            itineraryPlaylists: state.itineraryPlaylists.map((playlist) =>
              playlist.id === playlistId
                ? {
                    ...playlist,
                    completedListId: listId,
                    listIds: playlist.listIds.includes(listId)
                      ? playlist.listIds
                      : [...playlist.listIds, listId],
                  }
                : playlist,
            ),
          })),
        ),
      removeListFromItineraryPlaylist: (playlistId, listId) =>
        get().requireAuth(() =>
          set((state) => ({
            itineraryPlaylists: state.itineraryPlaylists.map((playlist) =>
              playlist.id === playlistId
                ? {
                    ...playlist,
                    listIds: playlist.listIds.filter((id) => id !== listId),
                  }
                : playlist,
            ),
          })),
        ),
      removeStopFromItineraryPlaylist: (playlistId, stopKey) =>
        get().requireAuth(() =>
          set((state) => ({
            itineraryPlaylists: state.itineraryPlaylists.map((playlist) =>
              playlist.id === playlistId
                ? {
                    ...playlist,
                    stopKeys: playlist.stopKeys.filter((key) => key !== stopKey),
                  }
                : playlist,
            ),
            itineraryStopScheduleById: Object.fromEntries(
              Object.entries(state.itineraryStopScheduleById).filter(
                ([key]) => key !== `${playlistId}::${stopKey}`,
              ),
            ),
          })),
        ),
      setPlacesBeenForUser: (userId, entries) =>
        set((state) => {
          const current = state.placesBeenByUserId[userId] ?? {
            countries: [],
            cities: [],
            places: [],
          };
          return {
            placesBeenByUserId: {
              ...state.placesBeenByUserId,
              [userId]: {
                countries: entries.countries ?? current.countries,
                cities: entries.cities ?? current.cities,
                places: entries.places ?? current.places,
              },
            },
          };
        }),
      submitList: (input) => {
        const { currentUser, openAuthModal } = get();

        if (!currentUser) {
          openAuthModal("signup");
          return {
            ok: false,
            message: "Sign in to submit a Google Maps list.",
          };
        }

        const isJournal = input.submissionType === "journal";
        const trimmedDescription = input.description.trim();
        const trimmedJournalNote = (input.journalNote ?? "").trim();
        const journalDescription = [trimmedDescription, trimmedJournalNote]
          .filter(Boolean)
          .join("\n\n");

        const localityToken = input.city?.trim() || input.country.trim();
        const hasCity = Boolean(input.city?.trim());
        const hasNeighborhood = Boolean(input.neighborhood?.trim());
        const nextList: MapList = {
          id: `submission-${Date.now()}`,
          slug: slugify(`${localityToken}-${input.submissionType}-${input.title}`),
          title: input.title,
          description: isJournal ? (journalDescription || "Journey journal entry.") : input.description,
          url: input.url,
          category: isJournal ? "Activities" : input.category,
          submissionType: input.submissionType,
          journal: isJournal
            ? {
                visitedAt: input.visitedAt,
                note: trimmedJournalNote || undefined,
                visibility: "public",
              }
            : undefined,
          location: {
            continent: input.continent,
            country: input.country,
            city: hasCity ? input.city : undefined,
            neighborhood: hasNeighborhood ? input.neighborhood : undefined,
            scope: hasCity ? "city" : "country",
          },
          creator: {
            id: currentUser.id,
            name: currentUser.name,
            avatar: currentUser.avatar,
          },
          upvotes: 1,
          createdAt: new Date().toISOString(),
          stops: input.stops ?? [],
        };

        set((state) => ({
          submittedLists: [nextList, ...state.submittedLists],
        }));
        void saveSubmittedGuide(nextList);

        return {
          ok: true,
          message:
            input.submissionType === "journal"
              ? "Experience saved."
              : "Guide saved.",
          list: nextList,
        };
      },
      updateSubmittedList: (listId, input) => {
        const { currentUser, openAuthModal, submittedLists } = get();

        if (!currentUser) {
          openAuthModal("signup");
          return {
            ok: false,
            message: "Sign in to edit your guide.",
          };
        }

        const existing = submittedLists.find((list) => list.id === listId);
        if (!existing) {
          return {
            ok: false,
            message: "Could not find that guide to edit.",
          };
        }

        if (existing.creator.id !== currentUser.id) {
          return {
            ok: false,
            message: "You can only edit your own guides.",
          };
        }

        const isJournal = input.submissionType === "journal";
        const trimmedDescription = input.description.trim();
        const trimmedJournalNote = (input.journalNote ?? "").trim();
        const journalDescription = [trimmedDescription, trimmedJournalNote]
          .filter(Boolean)
          .join("\n\n");
        const hasCity = Boolean(input.city?.trim());
        const hasNeighborhood = Boolean(input.neighborhood?.trim());

        const updatedList: MapList = {
          ...existing,
          title: input.title,
          description: isJournal ? (journalDescription || "Journey journal entry.") : input.description,
          url: input.url,
          category: isJournal ? "Activities" : input.category,
          submissionType: input.submissionType,
          journal: isJournal
            ? {
                visitedAt: input.visitedAt,
                note: trimmedJournalNote || undefined,
                visibility: existing.journal?.visibility ?? "public",
              }
            : undefined,
          location: {
            continent: input.continent,
            country: input.country,
            city: hasCity ? input.city : undefined,
            neighborhood: hasNeighborhood ? input.neighborhood : undefined,
            scope: hasCity ? "city" : "country",
          },
          stops: input.stops ?? existing.stops,
        };

        set((state) => ({
          submittedLists: state.submittedLists.map((list) =>
            list.id === listId ? updatedList : list,
          ),
        }));
        void saveSubmittedGuide(updatedList);

        return {
          ok: true,
          message: "Guide updated.",
          list: updatedList,
        };
      },
      deleteSubmittedList: (listId) => {
        const { currentUser, openAuthModal, submittedLists } = get();

        if (!currentUser) {
          openAuthModal("signup");
          return {
            ok: false,
            message: "Sign in to delete your guide.",
          };
        }

        const existing = submittedLists.find((list) => list.id === listId);
        if (!existing) {
          return {
            ok: false,
            message: "Could not find that guide.",
          };
        }

        if (existing.creator.id !== currentUser.id) {
          return {
            ok: false,
            message: "You can only delete your own guides.",
          };
        }

        set((state) => ({
          submittedLists: state.submittedLists.filter((list) => list.id !== listId),
        }));
        void deleteSubmittedGuide(listId);

        return {
          ok: true,
          message: "Guide deleted.",
        };
      },
      setJournalVisibility: (listId, visibility) =>
        get().requireAuth(() =>
          set((state) => {
            let updatedJournal: MapList | null = null;
            const submittedLists = state.submittedLists.map((list) => {
              if (
                list.id !== listId ||
                list.submissionType !== "journal" ||
                !state.currentUser ||
                list.creator.id !== state.currentUser.id
              ) {
                return list;
              }

              updatedJournal = {
                ...list,
                journal: {
                  ...list.journal,
                  visibility,
                },
              };

              return updatedJournal;
            });

            if (updatedJournal) {
              void saveSubmittedGuide(updatedJournal);
            }

            return { submittedLists };
          }),
        ),
    }),
    {
      name: "rguide-app-store",
      version: 5,
      partialize: (state) => ({
        currentUser: state.currentUser,
        favoriteIds: state.favoriteIds,
        votedIds: state.votedIds,
        itineraryIds: state.itineraryIds,
        itineraryStopIds: state.itineraryStopIds,
        itineraryStopScheduleById: state.itineraryStopScheduleById,
        itineraryPlaylists: state.itineraryPlaylists,
        placesBeenByUserId: state.placesBeenByUserId,
        submittedLists: state.submittedLists,
        isProfileShellActive: state.isProfileShellActive,
      }),
      migrate: (persistedState) => {
        const state = persistedState as Partial<AppState> | undefined;

        if (!state) {
          return {
            currentUser: null,
            isProfileShellActive: false,
            authModalOpen: false,
            authMode: "login",
            favoriteIds: [],
            votedIds: [],
            itineraryIds: [],
            itineraryStopIds: [],
            itineraryStopScheduleById: {},
            itineraryPlaylists: [
              {
                id: DEFAULT_ITINERARY_PLAYLIST_ID,
                name: "My Itinerary",
                listIds: [],
                stopKeys: [],
                completedListId: undefined,
                createdAt: new Date().toISOString(),
              },
            ],
            placesBeenByUserId: {},
            submittedLists: [],
          } as unknown as AppState;
        }

        return {
          ...state,
          currentUser: null,
          isProfileShellActive: state.isProfileShellActive ?? false,
          favoriteIds: state.favoriteIds ?? [],
          votedIds: state.votedIds ?? [],
          itineraryIds: state.itineraryIds ?? [],
          itineraryStopIds: state.itineraryStopIds ?? [],
          itineraryStopScheduleById: state.itineraryStopScheduleById ?? {},
          itineraryPlaylists:
            state.itineraryPlaylists?.length
              ? state.itineraryPlaylists
              : [
                  {
                    id: DEFAULT_ITINERARY_PLAYLIST_ID,
                    name: "My Itinerary",
                    listIds: [],
                    stopKeys: [],
                    completedListId: undefined,
                    createdAt: new Date().toISOString(),
                  },
                ],
          placesBeenByUserId: state.placesBeenByUserId ?? {},
          submittedLists: state.submittedLists ?? [],
          authModalOpen: false,
          authMode: state.authMode ?? "login",
        } as AppState;
      },
    },
  ),
);

export function getMergedLists(submittedLists: MapList[]) {
  return [...submittedLists, ...mapLists];
}
