import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { testimonialSchema } from "@/lib/validation/schemas";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { sendEmail, getAdminNotifyEmail, isSmtpConfigured } from "@/lib/email/smtp";
import { testimonialAdminEmail } from "@/lib/email/templates";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const limited = rateLimit(`testimonial:${ip}`, 3, 60_000);
    if (!limited.ok) {
      return NextResponse.json({ error: "Too many submissions. Please wait." }, { status: 429 });
    }

    const body = await req.json();
    const parsed = testimonialSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid review data" }, { status: 400 });
    }

    const data = parsed.data;
    const supabase = await createClient();

    const { error } = await supabase.from("testimonials").insert([
      {
        name: data.name,
        role: data.role || "Customer",
        message: data.message,
        rating: data.rating,
        approved: false,
      },
    ]);

    if (error) {
      return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
    }

    if (isSmtpConfigured()) {
      const adminEmail = getAdminNotifyEmail();
      if (adminEmail) {
        await sendEmail({
          to: adminEmail,
          ...testimonialAdminEmail(data.name, data.message, data.rating),
        }).catch(console.error);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("POST /api/testimonials:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
