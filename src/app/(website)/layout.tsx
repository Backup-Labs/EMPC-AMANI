import React from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { NewsletterStrip } from "@/components/NewsletterStrip";
import { WhatsAppWidget } from "@/components/WhatsAppWidget";
import { ChatbotWidget } from "@/components/ChatbotWidget";
import { PageTransition } from "@/components/ui/PageTransition";
import { Providers } from "@/components/Providers";
import { getSiteSettings } from "@/lib/cms/settings";

export const dynamic = "force-dynamic";

export default async function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  return (
    <Providers>
      <Navbar />
      <main className="flex-1">
        <PageTransition>{children}</PageTransition>
      </main>
      <NewsletterStrip />
      <Footer settings={settings} />
      <WhatsAppWidget />
      <ChatbotWidget />
    </Providers>
  );
}
