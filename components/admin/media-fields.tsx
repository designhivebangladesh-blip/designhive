"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { X, Upload, Loader2, Plus } from "lucide-react";
import { uploadToCloudinary, type UploadedAsset } from "@/lib/admin/cloudinary-client";
import { cloudinaryUrl } from "@/sanity/lib/image";
import { labelClass } from "./ui";

interface SingleUploaderProps {
  name: string;
  label: string;
  description?: string;
  required?: boolean;
  accept?: "image" | "video" | "any";
  initialValue?: UploadedAsset | null;
}

const ACCEPT_MAP: Record<NonNullable<SingleUploaderProps["accept"]>, string> = {
  image: "image/*",
  video: "video/*",
  any: "image/*,video/*",
};

export function ImageUploadField({
  name,
  label,
  description,
  required,
  accept = "image",
  initialValue,
}: SingleUploaderProps) {
  const [asset, setAsset] = useState<UploadedAsset | null>(initialValue ?? null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setError(null);
    setUploading(true);
    setProgress(0);
    try {
      const uploaded = await uploadToCloudinary(file, setProgress);
      setAsset(uploaded);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className={labelClass}>
        {label}
        {required ? <span className="text-gold-400"> *</span> : null}
      </label>
      {description ? <p className="mb-1.5 text-xs text-parchment/40">{description}</p> : null}

      <input type="hidden" name={name} value={asset ? JSON.stringify(asset) : ""} />

      {asset ? (
        <div className="flex items-center gap-3 rounded-lg border border-gold-400/20 bg-ink p-2">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-ink-soft">
            {asset.resource_type === "image" ? (
              <Image src={cloudinaryUrl(asset, { width: 128, height: 128, crop: "fill" })} alt="" fill className="object-cover" unoptimized />
            ) : (
              <video src={asset.secure_url} className="h-full w-full object-cover" muted />
            )}
          </div>
          <p className="min-w-0 flex-1 truncate text-xs text-parchment/60">{asset.public_id}</p>
          <button
            type="button"
            onClick={() => setAsset(null)}
            className="rounded-full p-1.5 text-parchment/50 hover:bg-white/10 hover:text-parchment"
            aria-label="Remove"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-gold-400/25 py-6 text-xs text-parchment/50 hover:border-gold-400/50 hover:text-parchment/80 disabled:opacity-60"
        >
          {uploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Uploading… {progress}%
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" /> Click to upload {accept === "video" ? "a video" : "an image"}
            </>
          )}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT_MAP[accept]}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
          e.target.value = "";
        }}
      />

      {error ? <p className="mt-1 text-xs text-red-300">{error}</p> : null}
    </div>
  );
}

interface GalleryFieldProps {
  name: string;
  label: string;
  description?: string;
  initialValue?: UploadedAsset[];
}

export function ImageGalleryField({ name, label, description, initialValue = [] }: GalleryFieldProps) {
  const [assets, setAssets] = useState<UploadedAsset[]>(initialValue);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList) {
    setError(null);
    setUploading(true);
    try {
      const uploaded = await Promise.all(Array.from(files).map((file) => uploadToCloudinary(file)));
      setAssets((prev) => [...prev, ...uploaded]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className={labelClass}>{label}</label>
      {description ? <p className="mb-1.5 text-xs text-parchment/40">{description}</p> : null}
      <input type="hidden" name={name} value={JSON.stringify(assets)} />

      <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
        {assets.map((asset, i) => (
          <div key={`${asset.public_id}-${i}`} className="group relative aspect-square overflow-hidden rounded-lg bg-ink-soft">
            <Image src={cloudinaryUrl(asset, { width: 160, height: 160, crop: "fill" })} alt="" fill className="object-cover" unoptimized />
            <button
              type="button"
              onClick={() => setAssets((prev) => prev.filter((_, idx) => idx !== i))}
              className="absolute right-1 top-1 rounded-full bg-ink/80 p-1 text-parchment opacity-0 transition group-hover:opacity-100"
              aria-label="Remove"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex aspect-square items-center justify-center rounded-lg border border-dashed border-gold-400/25 text-parchment/40 hover:border-gold-400/50 hover:text-parchment/70 disabled:opacity-60"
        >
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) void handleFiles(e.target.files);
          e.target.value = "";
        }}
      />
      {error ? <p className="mt-1 text-xs text-red-300">{error}</p> : null}
    </div>
  );
}
