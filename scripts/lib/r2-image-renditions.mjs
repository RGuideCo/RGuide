import sharp from "sharp";

export const R2_RENDITION_WIDTHS = [256, 640, 1280];
export const R2_RENDITION_CONTENT_TYPE = "image/webp";
export const R2_RENDITION_VERSION = 1;

export function buildRenditionKey(sourceKey, width) {
  const extensionIndex = sourceKey.lastIndexOf(".");
  if (extensionIndex < sourceKey.lastIndexOf("/") + 1) {
    throw new Error(`Cannot build rendition key for ${sourceKey}`);
  }
  return `${sourceKey.slice(0, extensionIndex)}-w${width}.webp`;
}

function orientedDimensions(metadata) {
  const width = Number(metadata.width) || null;
  const height = Number(metadata.height) || null;
  if (!width || !height) return { width, height };

  return metadata.orientation >= 5 && metadata.orientation <= 8
    ? { width: height, height: width }
    : { width, height };
}

export async function createR2ImageRenditions(sourceBytes, sourceKey) {
  const metadata = await sharp(sourceBytes, { failOn: "none" }).metadata();
  const original = orientedDimensions(metadata);
  if (!original.width || !original.height) {
    throw new Error(`Could not read image dimensions for ${sourceKey}`);
  }

  const variants = await Promise.all(
    R2_RENDITION_WIDTHS.map(async (requestedWidth) => {
      const { data, info } = await sharp(sourceBytes, { failOn: "none" })
        .rotate()
        .resize({
          width: requestedWidth,
          fit: "inside",
          withoutEnlargement: true,
        })
        .webp({ quality: 78, effort: 4, smartSubsample: true })
        .toBuffer({ resolveWithObject: true });

      return {
        requestedWidth,
        key: buildRenditionKey(sourceKey, requestedWidth),
        bytes: data,
        width: info.width,
        height: info.height,
        byteSize: info.size,
        contentType: R2_RENDITION_CONTENT_TYPE,
      };
    }),
  );

  return { original, variants };
}

export function serializeR2ImageRenditions(renditions) {
  return {
    version: R2_RENDITION_VERSION,
    format: R2_RENDITION_CONTENT_TYPE,
    variants: renditions.variants.map((variant) => ({
      requested_width: variant.requestedWidth,
      width: variant.width,
      height: variant.height,
      byte_size: variant.byteSize,
      storage_key: variant.key,
    })),
  };
}
