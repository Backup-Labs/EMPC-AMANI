import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { newsletterSendSchema } from "@/lib/validation/schemas";
import { sendEmail, isSmtpConfigured } from "@/lib/email/smtp";
import { newsletterCampaignEmail } from "@/lib/email/templates";
import { sanitizeHtml } from "@/lib/sanitize";

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("admin_profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || (profile.role !== "admin" && profile.role !== "editor")) return null;
  return user;
}

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createAdminClient(url, key, { auth: { persistSession: false } });
}

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!isSmtpConfigured()) {
      return NextResponse.json({ error: "SMTP is not configured" }, { status: 503 });
    }

    const body = await req.json();
    const parsed = newsletterSendSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid campaign data" }, { status: 400 });
    }

    const { subject, content } = parsed.data;
    const safeContent = sanitizeHtml(content);

    const supabase = getServiceClient();
    const { data: subscribers, error } = await supabase
      .from("subscribers")
      .select("email")
      .eq("status", "active");

    if (error || !subscribers?.length) {
      return NextResponse.json({ error: "No active subscribers" }, { status: 400 });
    }

    const campaign = newsletterCampaignEmail(subject, safeContent);
    let sent = 0;
    const batchSize = 10;

    for (let i = 0; i < subscribers.length; i += batchSize) {
      const batch = subscribers.slice(i, i + batchSize);
      await Promise.allSettled(
        batch.map((s) => sendEmail({ to: s.email, ...campaign }))
      );
      sent += batch.length;
    }

    await supabase.from("newsletter_campaigns").insert([
      {
        subject,
        content: safeContent,
        status: "sent",
        sent_at: new Date().toISOString(),
        recipient_count: sent,
      },
    ]);

    return NextResponse.json({ success: true, sent });
  } catch (err) {
    console.error("POST /api/newsletter/send:", err);
    return NextResponse.json({ error: "Failed to send newsletter" }, { status: 500 });
  }
}
