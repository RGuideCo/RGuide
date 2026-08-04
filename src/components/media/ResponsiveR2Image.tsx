"use client";

import type { ImgHTMLAttributes, SyntheticEvent } from "react";

const DEFAULT_RENDITION_WIDTHS = [256, 640, 1280] as const;
const R2_MEDIA_HOST = "media.rguide.co";

type ResponsiveR2ImageProps = Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  "src" | "srcSet" | "sizes"
> & {
  src: string;
  sizes: string;
  renditionWidths?: readonly number[];
};

export function getR2ImageRenditionUrl(src: string, width: number) {
  if (!Number.isInteger(width) || width < 1) return null;

  try {
    const url = new URL(src);
    if (url.hostname !== R2_MEDIA_HOST || !url.pathname.startsWith("/venues/")) {
      return null;
    }
    if (/-w\d+\.webp$/i.test(url.pathname)) {
      return null;
    }

    const extensionIndex = url.pathname.lastIndexOf(".");
    if (extensionIndex < url.pathname.lastIndexOf("/") + 1) {
      return null;
    }

    url.pathname = `${url.pathname.slice(0, extensionIndex)}-w${width}.webp`;
    return url.toString();
  } catch {
    return null;
  }
}

export function ResponsiveR2Image({
  src,
  sizes,
  renditionWidths = DEFAULT_RENDITION_WIDTHS,
  onError,
  ...imageProps
}: ResponsiveR2ImageProps) {
  const renditionUrls = renditionWidths
    .map((width) => {
      const url = getR2ImageRenditionUrl(src, width);
      return url ? `${url} ${width}w` : null;
    })
    .filter((value): value is string => Boolean(value));
  const srcSet = renditionUrls.join(", ");

  const handleError = (event: SyntheticEvent<HTMLImageElement>) => {
    const image = event.currentTarget;
    if (srcSet && image.dataset.r2OriginalFallback !== "true") {
      image.dataset.r2OriginalFallback = "true";
      image.srcset = "";
      image.src = src;
    }
    onError?.(event);
  };

  return (
    <img
      {...imageProps}
      src={src}
      srcSet={srcSet || undefined}
      sizes={srcSet ? sizes : undefined}
      onError={handleError}
    />
  );
}
