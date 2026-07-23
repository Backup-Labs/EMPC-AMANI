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
      <div className="flex min-h-dvh flex-col">
        <Navbar />
        <main className="flex-1 w-full">
          <PageTransition>{children}</PageTransition>
        </main>
        <NewsletterStrip />
        <Footer settings={settings} />
      </div>
      <WhatsAppWidget />
      <ChatbotWidget />
    </Providers>
  );
}
