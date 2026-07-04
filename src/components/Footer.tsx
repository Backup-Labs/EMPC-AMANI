"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import type { SiteSettings } from "@/lib/cms/settings";

const IconInstagram = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);
const IconFacebook = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);
const IconX = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4l11.733 16h4.267l-11.733-16zM4 20l6.768-6.768m2.46-2.46L20 4" />
  </svg>
);
const IconLinkedIn = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export function Footer({ settings }: { settings: SiteSettings }) {
  const { t } = useTranslation();

  const navLinks = [
    { name: t("nav.about"), href: "/about" },
    { name: t("nav.products"), href: "/products" },
    { name: t("nav.gallery"), href: "/gallery" },
    { name: t("nav.services"), href: "/services" },
    { name: t("nav.news"), href: "/news" },
    { name: t("nav.contact"), href: "/contact" },
  ];

  const socialLinks = [
    { Icon: IconInstagram, label: "Instagram", href: settings.social_instagram },
    { Icon: IconFacebook, label: "Facebook", href: settings.social_facebook },
    { Icon: IconX, label: "X", href: settings.social_twitter },
    { Icon: IconLinkedIn, label: "LinkedIn", href: settings.social_linkedin },
  ].filter((s) => s.href);

  return (
    <footer className="bg-background relative overflow-hidden pt-24 pb-12 transition-colors duration-300">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-[radial-gradient(circle_at_100%_0%,rgba(0,0,0,0.02)_0%,transparent_70%)] pointer-events-none opacity-50" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 pb-16 border-b border-border">
          <div className="flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-4 no-underline group">
              <div className="relative h-12 w-12 overflow-hidden rounded-full bg-white flex items-center justify-center p-1 border border-black/5 shadow-sm transition-transform group-hover:scale-105">
                <Image src="/logo.jpg" alt={`${settings.company_name} Logo`} fill sizes="48px" className="object-contain p-1" />
              </div>
              <span className="font-black text-3xl text-foreground tracking-tighter">{settings.company_name}</span>
            </Link>
            <div className="flex flex-col gap-2">
              <p className="text-foreground/60 text-base font-bold italic">{settings.company_tagline || t("footer.tagline")}</p>
              {settings.contact_email && (
                <Link href={`mailto:${settings.contact_email}`} className="text-foreground text-base font-bold hover:underline">
                  {settings.contact_email}
                </Link>
              )}
              {settings.contact_phone && (
                <Link href={`tel:${settings.contact_phone.replace(/\s/g, "")}`} className="text-foreground/70 text-sm font-bold hover:underline">
                  {settings.contact_phone}
                </Link>
              )}
              {settings.contact_address && (
                <p className="text-foreground/50 text-sm font-medium m-0">{settings.contact_address}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-8 md:items-end">
            <nav className="flex flex-wrap gap-x-10 gap-y-3 justify-start md:justify-end">
              {navLinks.map((l) => (
                <Link key={l.href} href={l.href} className="text-sm font-black text-foreground/40 no-underline hover:text-foreground transition-colors uppercase tracking-widest">
                  {l.name}
                </Link>
              ))}
            </nav>
            {socialLinks.length > 0 && (
              <div className="flex gap-3">
                {socialLinks.map(({ Icon, label, href }) => (
                  <Link
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="h-11 w-11 rounded-full flex items-center justify-center text-foreground border border-border hover:bg-foreground hover:text-background transition-all hover:-translate-y-0.5 shadow-sm"
                  >
                    <Icon />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="py-16 overflow-hidden text-center">
          <h2 className="font-black text-[12vw] lg:text-[10rem] leading-[0.75] tracking-[-0.06em] text-foreground m-0 select-none opacity-[0.03]">
            {settings.company_name}
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex gap-8">
            <Link href="/terms" className="text-[11px] font-black text-foreground/30 uppercase tracking-widest no-underline hover:text-foreground">
              {t("footer.terms")}
            </Link>
            <Link href="/privacy" className="text-[11px] font-black text-foreground/30 uppercase tracking-widest no-underline hover:text-foreground">
              {t("footer.privacy")}
            </Link>
          </div>
          <div className="flex gap-4 items-center">
            <p className="text-[11px] font-black text-foreground/30 uppercase tracking-widest">{t("footer.copyright")}</p>
            <div className="h-1 w-1 rounded-full bg-foreground/20" />
            <p className="text-[11px] font-black text-foreground/30 uppercase tracking-widest">{t("footer.workshop")}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
