"use client";

import { Upload } from "@/components/icons/MaterialSymbol";
import { ResponsiveR2Image } from "@/components/media/ResponsiveR2Image";

interface GuideStopMediaProps {
  name: string;
  index: number;
  photo?: string | null;
  accentColor: string;
  isEditing?: boolean;
  onSelect: () => void;
  onOpenPhoto?: () => void;
  onUploadPhoto?: (file?: File) => void;
}

export function GuideStopMedia({
  name,
  index,
  photo,
  accentColor,
  isEditing = false,
  onSelect,
  onOpenPhoto,
  onUploadPhoto,
}: GuideStopMediaProps) {
  return (
    <>
      <button
        type="button"
        onClick={onSelect}
        className="expanded-guide-stop-image-number-button"
        style={{ backgroundColor: accentColor }}
        aria-label={`Select ${name} on map`}
        title={`Select ${name} on map`}
      >
        {index + 1}
      </button>
      {isEditing ? (
        <label className="expanded-poi-bio-photo group relative cursor-pointer overflow-hidden" title={`Upload photo for ${name}`}>
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(event) => onUploadPhoto?.(event.currentTarget.files?.[0])}
          />
          {photo ? (
            <ResponsiveR2Image
              src={photo}
              sizes="(max-width: 520px) calc(100vw - 2rem), (max-width: 1024px) 45vw, 520px"
              alt=""
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="flex h-full w-full flex-col items-center justify-center gap-1 bg-slate-100 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
              <Upload className="h-4 w-4" />
              Photo
            </span>
          )}
          <span className="absolute inset-x-0 bottom-0 bg-slate-950/75 px-2 py-1 text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-white opacity-0 transition group-hover:opacity-100">
            Upload
          </span>
        </label>
      ) : (
        <button
          type="button"
          onClick={onOpenPhoto}
          className="expanded-poi-bio-photo"
          aria-label={`Open photo of ${name}`}
          title={`Open photo of ${name}`}
        >
          {photo ? (
            <ResponsiveR2Image
              src={photo}
              sizes="(max-width: 520px) calc(100vw - 2rem), (max-width: 1024px) 45vw, 520px"
              alt=""
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
          ) : null}
        </button>
      )}
    </>
  );
}
