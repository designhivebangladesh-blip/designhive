/**
 * Client-side direct-to-Cloudinary upload, signed by
 * /api/admin/cloudinary-sign. Mirrors what sanity-plugin-cloudinary does
 * inside Studio, so the resulting object is stored as the exact same
 * shape as any `cloudinary.asset` field, whichever surface created it.
 */

export interface UploadedAsset {
  public_id: string;
  resource_type: "image" | "video";
  format?: string;
  version?: number;
  secure_url: string;
  bytes?: number;
  width?: number;
  height?: number;
}

export class CloudinaryUploadError extends Error {}

export async function uploadToCloudinary(
  file: File,
  onProgress?: (percent: number) => void
): Promise<UploadedAsset> {
  const resourceType = file.type.startsWith("video/") ? "video" : "image";

  const signRes = await fetch("/api/admin/cloudinary-sign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ resource_type: resourceType }),
  });

  if (!signRes.ok) {
    const body = await signRes.json().catch(() => null);
    throw new CloudinaryUploadError(body?.error?.message ?? "Could not get an upload signature.");
  }

  const { data: sig } = (await signRes.json()) as {
    data: { signature: string; timestamp: number; folder: string; apiKey: string; cloudName: string };
  };

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", sig.apiKey);
  formData.append("timestamp", String(sig.timestamp));
  formData.append("signature", sig.signature);
  formData.append("folder", sig.folder);

  const asset = await new Promise<UploadedAsset>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `https://api.cloudinary.com/v1_1/${sig.cloudName}/${resourceType}/upload`);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      try {
        const json = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve({
            public_id: json.public_id,
            resource_type: json.resource_type,
            format: json.format,
            version: json.version,
            secure_url: json.secure_url,
            bytes: json.bytes,
            width: json.width,
            height: json.height,
          });
        } else {
          reject(new CloudinaryUploadError(json?.error?.message ?? "Upload failed."));
        }
      } catch {
        reject(new CloudinaryUploadError("Upload failed — unexpected response from Cloudinary."));
      }
    };

    xhr.onerror = () => reject(new CloudinaryUploadError("Upload failed — network error."));
    xhr.send(formData);
  });

  return asset;
}
