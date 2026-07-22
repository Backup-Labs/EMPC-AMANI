type Transporter = {
  sendMail: (opts: Record<string, unknown>) => Promise<unknown>;
};

let transporter: Transporter | null = null;

function getSmtpConfig() {
  const host = process.env.SMTP_HOST || process.env.MAIL_HOST;
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const user = process.env.SMTP_USER || process.env.SMTP_USERNAME;
  const pass = process.env.SMTP_PASSWORD;
  const fromEmail = user || "";
  const from =
    process.env.SMTP_FROM ||
    (fromEmail ? `EMPC-AMANI <${fromEmail}>` : undefined);

  if (!host || !user || !pass || !from) {
    return null;
  }

  return {
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    from: from.includes("<") ? from : `EMPC-AMANI <${from}>`,
  };
}

export function isSmtpConfigured(): boolean {
  return getSmtpConfig() !== null;
}

async function getTransporter(): Promise<Transporter> {
  if (transporter) return transporter;
  const config = getSmtpConfig();
  if (!config) {
    throw new Error("SMTP is not configured. Set SMTP_HOST, SMTP_USER, SMTP_PASSWORD, and SMTP_FROM in .env.local");
  }
  const nodemailer = await import("nodemailer");
  const { from: _from, ...transportOpts } = config;
  transporter = nodemailer.createTransport(transportOpts) as Transporter;
  return transporter;
}

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

export async function sendEmail(options: SendEmailOptions): Promise<void> {
  const config = getSmtpConfig();
  if (!config) {
    console.warn("[email] SMTP not configured — skipping send:", options.subject);
    return;
  }

  const transport = await getTransporter();
  await transport.sendMail({
    from: config.from,
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text || options.html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(),
    replyTo: options.replyTo,
  });
}

export function getAdminNotifyEmail(): string {
  return (
    process.env.SMTP_ADMIN_EMAIL ||
    process.env.SMTP_FROM ||
    process.env.SMTP_USER ||
    process.env.SMTP_USERNAME ||
    ""
  );
}
