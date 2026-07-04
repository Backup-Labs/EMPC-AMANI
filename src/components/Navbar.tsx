"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

const HERO_ROUTES = ["/", "/about", "/services", "/gallery", "/news", "/contact", "/testimonials"];
const SCROLL_COMPACT_THRESHOLD = 12;
const SCROLL_HIDE_THRESHOLD = 100;
const SCROLL_DELTA = 6;

/** Compact pill + glass — same as product detail / light-background pages */
const COMPACT_NAV_BAR =
  "glass-nav rounded-full px-5 py-2.5 md:px-7 shadow-lg shadow-primary/5";
const EXPANDED_NAV_BAR = "bg-transparent py-6 md:py-8";

function isLightBgRoute(pathname: string): boolean {
  if (pathname.startsWith("/products")) return true;
  if (pathname.startsWith("/portal")) return true;
  if (pathname.startsWith("/news/") && pathname !== "/news") return true;
  return false;
}

function hasHeroImage(pathname: string): boolean {
  return HERO_ROUTES.includes(pathname);
}

export function Navbar() {
  const [scrollY, setScrollY] = useState(0);
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const lastScrollY = useRef(0);
  const pathname = usePathname();
  const { t } = useTranslation();

  const lightBg = isLightBgRoute(pathname);
  const heroPage = hasHeroImage(pathname);
  /** Product pages always use compact nav; hero pages switch on scroll */
  const compactNav = lightBg || scrollY > SCROLL_COMPACT_THRESHOLD;
  const lightText = heroPage && !compactNav;

  const navLinks = [
    { name: t("nav.about"), href: "/about" },
    { name: t("nav.products"), href: "/products" },
    { name: t("nav.gallery"), href: "/gallery" },
    { name: t("nav.services"), href: "/services" },
    { name: t("nav.news"), href: "/news" },
    { name: t("nav.contact"), href: "/contact" },
    { name: t("nav.portals"), href: "/portal" },
  ];

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    let rafId = 0;
    const handler = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const delta = currentY - lastScrollY.current;

        setScrollY(currentY);

        if (!mobileOpen) {
          if (currentY <= SCROLL_HIDE_THRESHOLD) {
            setHidden(false);
          } else if (delta > SCROLL_DELTA) {
            setHidden(true);
          } else if (delta < -SCROLL_DELTA) {
            setHidden(false);
          }
        }

        lastScrollY.current = currentY;
      });
    };

    window.addEventListener("scroll", handler, { passive: true });
    handler();
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", handler);
    };
  }, [mobileOpen]);

  useEffect(() => {
    setMobileOpen(false);
    setHidden(false);
    lastScrollY.current = window.scrollY;
    setScrollY(window.scrollY);
  }, [pathname]);

  const linkClass = (active: boolean) => {
    if (compactNav) {
      return active
        ? "text-foreground"
        : "text-foreground/65 hover:text-foreground";
    }
    return "text-white/90 hover:text-white nav-text-shadow";
  };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{
          y: hidden ? "-110%" : 0,
          opacity: hidden ? 0 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 380,
          damping: 32,
          mass: 0.8,
        }}
        className={`fixed top-0 left-0 right-0 z-50 px-4 md:px-0 ${hidden ? "pointer-events-none" : ""}`}
      >
        <motion.div
          animate={{
            marginTop: compactNav ? 12 : 0,
            maxWidth: compactNav ? 920 : 1344,
          }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          className="mx-auto px-6 md:px-12 lg:px-16 w-full"
        >
          <motion.div
            layout
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className={`flex items-center justify-between ${
              compactNav ? COMPACT_NAV_BAR : EXPANDED_NAV_BAR
            }`}
          >
            <Link href="/" className="flex items-center gap-3 no-underline group shrink-0">
              <div className="relative h-9 w-9 md:h-10 md:w-10 overflow-hidden rounded-full bg-white flex items-center justify-center p-1 border border-black/5 shadow-sm transition-transform group-hover:scale-105">
                <Image src="/logo.jpg" alt="EMPC-AMANI Logo" fill sizes="40px" className="object-contain p-1" priority />
              </div>
              <span
                className={`font-bold text-lg md:text-xl tracking-tighter transition-colors duration-300 ${
                  lightText ? "text-white nav-text-shadow" : "text-foreground"
                }`}
              >
                EMPC-AMANI
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-[12px] font-bold no-underline transition-colors tracking-tight ${linkClass(active)}`}
                  >
                    {link.name}
                  </Link>
                );
              })}
              <LanguageSwitcher variant={lightText ? "light" : "dark"} />
            </nav>

            <div className="flex lg:hidden items-center gap-2">
              <LanguageSwitcher variant={lightText ? "light" : "dark"} />
              <button
                className={`flex items-center justify-center transition-colors p-1 ${
                  lightText ? "text-white nav-text-shadow" : "text-foreground"
                }`}
                onClick={() => {
                  setHidden(false);
                  setMobileOpen(true);
                }}
                aria-label={t("nav.openMenu")}
              >
                <Menu size={24} />
              </button>
            </div>
          </motion.div>
        </motion.div>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-0 z-100 flex flex-col bg-background text-foreground"
          >
            <div className="flex items-center justify-between p-6">
              <div className="flex items-center gap-3">
                <div className="relative h-9 w-9 overflow-hidden rounded-full bg-white flex items-center justify-center p-1 border border-black/5 shadow-sm">
                  <Image src="/logo.jpg" alt="EMPC-AMANI Logo" fill sizes="36px" className="object-contain p-1" priority />
                </div>
                <span className="font-bold text-lg tracking-tighter">EMPC-AMANI</span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="h-11 w-11 flex items-center justify-center rounded-2xl bg-muted hover:bg-foreground/10 text-foreground transition-transform active:scale-90"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="flex flex-col gap-5 px-8 pt-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="font-bold text-3xl text-foreground no-underline tracking-tighter block hover:translate-x-1 transition-transform"
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            <div className="mt-auto p-8 flex flex-col gap-2">
              <p className="text-[10px] font-bold text-foreground/60 tracking-widest uppercase mb-2">
                {t("nav.socials")}
              </p>
              <div className="flex gap-4">
                {["Instagram", "Twitter", "LinkedIn"].map((s) => (
                  <span key={s} className="text-xs font-bold text-foreground">{s}</span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
