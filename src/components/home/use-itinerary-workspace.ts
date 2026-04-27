import { useEffect, useMemo, useState } from "react";

import { ItineraryPlaylist } from "@/store/app-store";
import { MapList } from "@/types";

type UseItineraryWorkspaceInput = {
  activeGuideRail: string;
  itineraryPlaylists: ItineraryPlaylist[];
  globalMergedLists: MapList[];
  itineraryStopScheduleById: Record<string, { date?: string; time?: string }>;
};

function hasPlaylistContent(playlist: ItineraryPlaylist) {
  return Boolean(playlist.completedListId) || playlist.listIds.length > 0 || playlist.stopKeys.length > 0;
}

export function useItineraryWorkspace({
  activeGuideRail,
  itineraryPlaylists,
  globalMergedLists,
  itineraryStopScheduleById,
}: UseItineraryWorkspaceInput) {
  const [activeItineraryPlaylistId, setActiveItineraryPlaylistId] = useState<string | null>(null);
  const [isItineraryEditing, setIsItineraryEditing] = useState(false);

  const activeItineraryPlaylist = useMemo(
    () =>
      itineraryPlaylists.find((playlist) => playlist.id === activeItineraryPlaylistId) ??
      itineraryPlaylists[0] ??
      null,
    [activeItineraryPlaylistId, itineraryPlaylists],
  );

  const itineraryStopEntries = useMemo(
    () =>
      (activeItineraryPlaylist?.stopKeys ?? [])
        .map((stopKey) => {
          const separatorIndex = stopKey.indexOf(":");
          if (separatorIndex <= 0) {
            return null;
          }
          const listId = stopKey.slice(0, separatorIndex);
          const stopId = stopKey.slice(separatorIndex + 1);
          const list = globalMergedLists.find((item) => item.id === listId);
          const stop = list?.stops.find((item) => item.id === stopId);
          if (!list || !stop) {
            return null;
          }
          const scheduleKey = `${activeItineraryPlaylist?.id}::${stopKey}`;
          return {
            key: stopKey,
            list,
            stop,
            scheduleKey,
            schedule: itineraryStopScheduleById[scheduleKey],
          };
        })
        .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry)),
    [activeItineraryPlaylist?.id, activeItineraryPlaylist?.stopKeys, globalMergedLists, itineraryStopScheduleById],
  );

  const buildItineraryStops = () =>
    itineraryStopEntries.map((entry, index) => {
      const scheduleBits = [entry.schedule?.date, entry.schedule?.time].filter(Boolean).join(" ");
      return {
        id: `itinerary-stop-${index + 1}-${entry.stop.id}`,
        name: entry.stop.name,
        coordinates: entry.stop.coordinates,
        description: scheduleBits
          ? `${entry.stop.description} Scheduled: ${scheduleBits}`
          : entry.stop.description,
      };
    });

  useEffect(() => {
    if (activeGuideRail !== "itinerary") {
      setIsItineraryEditing(false);
    }
  }, [activeGuideRail]);

  useEffect(() => {
    if (!itineraryPlaylists.length) {
      setActiveItineraryPlaylistId(null);
      return;
    }
    if (
      !activeItineraryPlaylistId ||
      !itineraryPlaylists.some((playlist) => playlist.id === activeItineraryPlaylistId)
    ) {
      setActiveItineraryPlaylistId(itineraryPlaylists[0].id);
    }
  }, [activeItineraryPlaylistId, itineraryPlaylists]);

  useEffect(() => {
    if (activeGuideRail !== "itinerary" || !itineraryPlaylists.length) {
      return;
    }
    const activePlaylist = itineraryPlaylists.find((playlist) => playlist.id === activeItineraryPlaylistId) ?? null;
    if (activePlaylist && hasPlaylistContent(activePlaylist)) {
      return;
    }
    const playlistWithContent = itineraryPlaylists.find((playlist) => hasPlaylistContent(playlist));
    if (playlistWithContent && playlistWithContent.id !== activeItineraryPlaylistId) {
      setActiveItineraryPlaylistId(playlistWithContent.id);
    }
  }, [activeGuideRail, activeItineraryPlaylistId, itineraryPlaylists]);

  return {
    activeItineraryPlaylist,
    activeItineraryPlaylistId,
    setActiveItineraryPlaylistId,
    isItineraryEditing,
    setIsItineraryEditing,
    itineraryStopEntries,
    buildItineraryStops,
  };
}
