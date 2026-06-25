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
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css"
          integrity="sha512-Kc323vGBEqzTmouAECnVceyQqyqdsSiqLQISBL29aUW4U/M7pSPA/gEUZQqv1cwx4OnYxTxve5UMg5GT6L4JJg=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
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
