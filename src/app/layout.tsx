import type { Metadata } from "next";
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
    <html lang="en">
      <head>
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@900,800,700,500,400,300&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        style={{ fontFamily: "'Satoshi', sans-serif" }}
        className="min-h-screen bg-background text-foreground flex flex-col antialiased"
      >
        {children}
      </body>
    </html>
  );
}
