export type UploadBucket = "products" | "gallery" | "news" | "media" | "avatars";

export async function uploadFile(
  file: File,
  bucket: UploadBucket = "media",
  onProgress?: (pct: number) => void
): Promise<string> {
  onProgress?.(10);
  const formData = new FormData();
  formData.append("file", file);
  formData.append("bucket", bucket);

  onProgress?.(30);
  const res = await fetch("/api/upload", { method: "POST", body: formData });
  onProgress?.(90);

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Upload failed");
  }

  const { url } = await res.json();
  onProgress?.(100);
  return url as string;
}
