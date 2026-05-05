import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "EMPC-AMANI | Master Carpentry & Furniture",
  description: "Bespoke carpentry and furniture craftsmanship. Empowering future artisans through vocational excellence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@900,800,700,500,400,300&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        style={{ fontFamily: "'Satoshi', sans-serif" }}
        className="min-h-screen bg-white dark:bg-[#0a0a0a] text-[#111111] dark:text-[#f0f0f0] flex flex-col antialiased transition-colors duration-300"
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
