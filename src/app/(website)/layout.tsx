import React from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { NewsletterStrip } from "@/components/NewsletterStrip";
import { WhatsAppWidget } from "@/components/WhatsAppWidget";
import { ChatbotWidget } from "@/components/ChatbotWidget";

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <NewsletterStrip />
      <Footer />
      <WhatsAppWidget />
      <ChatbotWidget />
    </>
  );
}
