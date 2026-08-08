import { NATURE_STOP_MEDIA } from "@/data/guides/nature-stop-media";

function isRenderableImageUrl(value: string, officialUrl?: string) {
  const normalizedValue = value.replace(/\/$/, "");
  const normalizedOfficialUrl = officialUrl?.trim().replace(/\/$/, "");
  if (normalizedOfficialUrl && normalizedValue === normalizedOfficialUrl) return false;

  try {
    const url = new URL(value);
    if (url.hostname === "commons.wikimedia.org" && url.pathname.startsWith("/wiki/File:")) {
      return false;
    }
  } catch {
    // Local paths and data URLs remain valid image sources.
  }

  return true;
}

export function getRenderableGuidePhoto(
  photo?: string,
  officialUrl?: string,
  stopId?: string,
) {
  const canonicalNaturePhoto = stopId ? NATURE_STOP_MEDIA[stopId]?.photo : undefined;
  if (canonicalNaturePhoto) return canonicalNaturePhoto;

  const value = photo?.trim();
  if (!value || !isRenderableImageUrl(value, officialUrl)) return null;
  return value;
}
