import React from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { NewsletterStrip } from "@/components/NewsletterStrip";
import { WhatsAppWidget } from "@/components/WhatsAppWidget";
import { ChatbotWidget } from "@/components/ChatbotWidget";
import { PageTransition } from "@/components/ui/PageTransition";

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <PageTransition>{children}</PageTransition>
      </main>
      <NewsletterStrip />
      <Footer />
      <WhatsAppWidget />
      <ChatbotWidget />
    </>
  );
}
