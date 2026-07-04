import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { uploadFile, isValidBucket } from "@/lib/storage/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("admin_profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    const { data: customer } = await supabase
      .from("customer_profiles")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();

    const isAdmin = profile && (profile.role === "admin" || profile.role === "editor");
    const isCustomer = !!customer;

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const bucketParam = (formData.get("bucket") as string) || "media";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!isValidBucket(bucketParam)) {
      return NextResponse.json({ error: "Invalid bucket" }, { status: 400 });
    }

    // Customers may only upload avatars
    if (!isAdmin && !(isCustomer && bucketParam === "avatars")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File exceeds 10MB limit" }, { status: 400 });
    }

    if (!file.type.startsWith("image/") && bucketParam !== "media") {
      return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 });
    }

    const { url } = await uploadFile(file, bucketParam);
    return NextResponse.json({ url });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
