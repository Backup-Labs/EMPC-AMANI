import { sanitizeHtml } from "@/lib/sanitize";

function layout(body: string): string {
  return `<!DOCTYPE html><html><body style="font-family:system-ui,sans-serif;background:#ffebe4;margin:0;padding:24px">
<div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;padding:32px;border:1px solid #eee">
<div style="font-weight:900;font-size:18px;color:#0a0c82;margin-bottom:24px">EMPC-AMANI</div>
${body}
<p style="margin-top:32px;font-size:12px;color:#888">© EMPC-AMANI · Kigali, Rwanda</p>
</div></body></html>`;
}

export function contactAdminEmail(data: {
  full_name: string;
  email: string;
  phone?: string | null;
  subject?: string | null;
  message: string;
  inquiry_type: string;
}) {
  const subject = `[Inquiry] ${data.subject || data.inquiry_type} — ${data.full_name}`;
  const html = layout(`
    <h2 style="color:#0a0c82;margin:0 0 16px">New Contact Inquiry</h2>
    <p><strong>Name:</strong> ${escapeHtml(data.full_name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
    ${data.phone ? `<p><strong>Phone:</strong> ${escapeHtml(data.phone)}</p>` : ""}
    <p><strong>Type:</strong> ${escapeHtml(data.inquiry_type)}</p>
    ${data.subject ? `<p><strong>Subject:</strong> ${escapeHtml(data.subject)}</p>` : ""}
    <p style="margin-top:16px;white-space:pre-wrap">${escapeHtml(data.message)}</p>
  `);
  return { subject, html };
}

export function contactConfirmationEmail(name: string) {
  return {
    subject: "We received your message — EMPC-AMANI",
    html: layout(`
      <h2 style="color:#0a0c82;margin:0 0 16px">Thank you, ${escapeHtml(name)}!</h2>
      <p>We have received your inquiry and our team will respond within one business day.</p>
      <p style="margin-top:16px;color:#555">Craftsmanship rooted in heritage.</p>
    `),
  };
}

export function newsletterWelcomeEmail() {
  return {
    subject: "Welcome to EMPC-AMANI Newsletter",
    html: layout(`
      <h2 style="color:#0a0c82;margin:0 0 16px">You're subscribed!</h2>
      <p>Thank you for joining our newsletter. You'll receive updates on new collections, craft stories, and training programs.</p>
    `),
  };
}

export function newsletterCampaignEmail(subject: string, content: string) {
  return {
    subject,
    html: layout(sanitizeHtml(content)),
  };
}

export function testimonialAdminEmail(name: string, message: string, rating: number) {
  return {
    subject: `[Review] New testimonial from ${name}`,
    html: layout(`
      <h2 style="color:#0a0c82;margin:0 0 16px">New Testimonial Pending Approval</h2>
      <p><strong>${escapeHtml(name)}</strong> · ${rating}/5 stars</p>
      <p style="font-style:italic;margin-top:12px">"${escapeHtml(message)}"</p>
      <p style="margin-top:16px;font-size:13px;color:#666">Approve in Admin → Testimonials</p>
    `),
  };
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
