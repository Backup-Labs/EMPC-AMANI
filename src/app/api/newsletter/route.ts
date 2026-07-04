import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { newsletterSchema } from "@/lib/validation/schemas";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { sendEmail, isSmtpConfigured } from "@/lib/email/smtp";
import { newsletterWelcomeEmail } from "@/lib/email/templates";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const limited = rateLimit(`newsletter:${ip}`, 8, 60_000);
    if (!limited.ok) {
      return NextResponse.json({ error: "Too many requests." }, { status: 429 });
    }

    const body = await req.json();
    const parsed = newsletterSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    const { email } = parsed.data;
    const supabase = await createClient();

    const { error } = await supabase.from("subscribers").insert([{ email, status: "active" }]);

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ success: true, message: "Already subscribed" });
      }
      return NextResponse.json({ error: "Subscription failed" }, { status: 500 });
    }

    if (isSmtpConfigured()) {
      await sendEmail({ to: email, ...newsletterWelcomeEmail() }).catch(console.error);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("POST /api/newsletter:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
