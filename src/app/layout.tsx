import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "EMPC-AMANI | Interior Design & Architecture",
  description: "Crafting beautiful spaces that reflect your personality and style.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@900,800,700,500,400,300&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        style={{ fontFamily: "'Satoshi', sans-serif" }}
        className="min-h-screen bg-white text-[#111111] flex flex-col antialiased"
      >
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
