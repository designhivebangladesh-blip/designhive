import { createImageUrlBuilder } from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";

import { client } from "@/sanity/lib/client";

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

/**
 * Matches the shape sanity-plugin-cloudinary stores on a `cloudinary.asset`
 * field (see its README for the full object — only the fields needed for
 * URL-building are typed here).
 */
export interface CloudinaryAsset {
  public_id: string;
  resource_type: "image" | "video";
  format?: string;
  version?: number;
  secure_url: string;
}

export interface CloudinaryTransformOptions {
  width?: number;
  height?: number;
  quality?: "auto" | number;
  format?: "auto" | string;
  crop?: "fill" | "fit" | "scale" | "crop" | "thumb";
}

/**
 * Builds an optimized Cloudinary delivery URL from a stored asset
 * reference. Falls back to the asset's own `secure_url` (unoptimized but
 * always valid) if the cloud name env var is missing, rather than
 * throwing — a missing transform is better than a broken image.
 */
export function cloudinaryUrl(
  asset: CloudinaryAsset,
  options: CloudinaryTransformOptions = {}
): string {
  if (!CLOUD_NAME || !asset?.public_id) {
    return asset?.secure_url ?? "";
  }

  const { width, height, quality = "auto", format = "auto", crop = "fill" } = options;

  const transforms = [
    format && `f_${format}`,
    quality && `q_${quality}`,
    width && `w_${width}`,
    height && `h_${height}`,
    (width || height) && `c_${crop}`,
  ]
    .filter(Boolean)
    .join(",");

  const versionSegment = asset.version ? `v${asset.version}/` : "";
  const extension = asset.format ? `.${asset.format}` : "";

  return `https://res.cloudinary.com/${CLOUD_NAME}/${asset.resource_type}/upload/${transforms}/${versionSegment}${asset.public_id}${extension}`;
}

// Fallback for Sanity's native `image` type, not currently used by any
// schema field (media is stored via cloudinary.asset instead) but kept
// available since @sanity/image-url is an installed dependency.
const builder = createImageUrlBuilder(client);

export function urlForSanityImage(source: SanityImageSource) {
  return builder.image(source);
}
