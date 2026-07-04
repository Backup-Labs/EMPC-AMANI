import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

// const BUCKETS = ["products", "gallery", "news", "media", "avatars"] as const;
const BUCKETS = "empc" as const;
export type StorageBucket = (typeof BUCKETS)[number];

export function isValidBucket(bucket: string): bucket is StorageBucket {
  return BUCKETS.includes(bucket as StorageBucket);
}

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (serviceKey) {
    return createSupabaseClient(url, serviceKey, { auth: { persistSession: false } });
  }
  return null;
}

export async function uploadFile(
  file: File,
  bucket: StorageBucket,
  folder?: string
): Promise<{ url: string; path: string }> {
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const path = folder ? `${folder}/${safeName}` : safeName;

  const admin = getAdminClient();
  const supabase = admin || (await createClient());

  const buffer = Buffer.from(await file.arrayBuffer());
  const { error } = await supabase.storage.from(bucket).upload(path, buffer, {
    contentType: file.type || "image/jpeg",
    upsert: false,
  });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return { url: data.publicUrl, path };
}

export async function deleteFile(bucket: StorageBucket, path: string): Promise<void> {
  const admin = getAdminClient();
  const supabase = admin || (await createClient());
  await supabase.storage.from(bucket).remove([path]);
}
