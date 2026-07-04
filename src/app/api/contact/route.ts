import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { contactSchema } from "@/lib/validation/schemas";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { sendEmail, getAdminNotifyEmail, isSmtpConfigured } from "@/lib/email/smtp";
import { contactAdminEmail, contactConfirmationEmail } from "@/lib/email/templates";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const limited = rateLimit(`contact:${ip}`, 5, 60_000);
    if (!limited.ok) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers: { "Retry-After": String(limited.retryAfter) } }
      );
    }

    const body = await req.json();
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid form data", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const supabase = await createClient();

    const { error } = await supabase.from("inquiries").insert([
      {
        full_name: data.full_name,
        email: data.email,
        phone: data.phone || null,
        subject: data.subject || null,
        message: data.message,
        inquiry_type: data.inquiry_type,
        status: "new",
      },
    ]);

    if (error) {
      console.error("contact insert:", error.message);
      return NextResponse.json({ error: "Failed to submit inquiry" }, { status: 500 });
    }

    if (isSmtpConfigured()) {
      const adminEmail = getAdminNotifyEmail();
      const admin = contactAdminEmail(data);
      const tasks: Promise<void>[] = [
        sendEmail({ to: data.email, ...contactConfirmationEmail(data.full_name) }),
      ];
      if (adminEmail) {
        tasks.push(sendEmail({ to: adminEmail, replyTo: data.email, ...admin }));
      }
      await Promise.allSettled(tasks);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("POST /api/contact:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
