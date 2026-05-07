import type { GuideStop, MapList } from "@/types";

export interface EditorialPoiPhotoRecord {
  id: string;
  photo: string | null;
}

export function applyEditorialPoiPhotos(guides: MapList[], pois: EditorialPoiPhotoRecord[]) {
  const photoByPoiId = new Map(
    pois
      .filter((poi) => poi.photo)
      .map((poi) => [poi.id, poi.photo as string]),
  );

  const applyStopPhoto = (stop: GuideStop): GuideStop => ({
    ...stop,
    photo: stop.poiId ? photoByPoiId.get(stop.poiId) ?? stop.photo : stop.photo,
    places: stop.places?.map(applyStopPhoto),
  });

  return guides.map((guide) => ({
    ...guide,
    stops: guide.stops.map(applyStopPhoto),
  }));
}
