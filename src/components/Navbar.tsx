"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

const navLinks = [
  { name: "About", href: "/about" },
  { name: "Gallery", href: "/gallery" },
  { name: "Services", href: "/services" },
  { name: "News", href: "/news" },
  { name: "Contact", href: "/contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    const handler = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener("scroll", handler, { passive: true });
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" as any }}
        className="fixed top-0 left-0 right-0 z-50 px-4 md:px-0"
      >
        {/* Transparent bar that morphs into a pill on scroll */}
        <div
          className="transition-all duration-500 ease-in-out mx-auto px-6 md:px-12 lg:px-16"
          style={{
            marginTop: scrolled ? "16px" : "0",
            maxWidth: scrolled ? "850px" : "1344px",
            width: "100%",
          }}
        >
          <div
            className={`
              flex items-center justify-between transition-all duration-500 ease-in-out
              ${scrolled 
                ? "glass rounded-full px-6 py-3 md:px-8 shadow-sm" 
                : "bg-transparent py-8"
              }
            `}
          >
            {/* Logo */}
            <Link
              href="/"
              className={`
                font-bold text-xl tracking-tighter transition-all duration-300 no-underline
                ${scrolled ? "text-foreground" : "text-white"}
              `}
            >
              EMPC-AMANI
            </Link>

            {/* Desktop links */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`
                      text-[13px] font-bold no-underline transition-colors tracking-tight
                      ${scrolled 
                        ? (active ? "text-foreground" : "text-foreground/60 hover:text-foreground") 
                        : "text-white/80 hover:text-white"
                      }
                    `}
                  >
                    {link.name}
                  </Link>
                );
              })}
              
              {/* Theme Toggle */}
              {mounted && (
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className={`
                    p-2 rounded-full transition-colors
                    ${scrolled ? "hover:bg-black/5 dark:hover:bg-white/10" : "hover:bg-white/10"}
                    ${scrolled ? "text-foreground" : "text-white"}
                  `}
                >
                  {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                </button>
              )}
            </nav>

            {/* Mobile hamburger */}
            <div className="flex md:hidden items-center gap-4">
               {mounted && (
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className={`p-2 ${scrolled ? "text-foreground" : "text-white"}`}
                >
                  {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                </button>
              )}
              <button
                className={`
                  flex items-center justify-center transition-colors
                  ${scrolled ? "text-foreground" : "text-white"}
                `}
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-0 z-100 flex flex-col bg-background text-foreground"
          >
            <div className="flex items-center justify-between p-6 md:p-10">
              <span className="font-bold text-lg tracking-tighter">
                EMPC-AMANI
              </span>
              <button
                onClick={() => setMobileOpen(false)}
                className="h-12 w-12 flex items-center justify-center rounded-3xl bg-muted hover:bg-foreground/10 text-foreground transition-transform active:scale-90"
              >
                <X size={20} />
              </button>
            </div>
            
            <nav className="flex flex-col gap-6 px-10 pt-10">
              {navLinks.map((link) => (
                <motion.div 
                  key={link.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="font-bold text-[2.5rem] text-foreground no-underline tracking-tighter block hover:translate-x-2 transition-transform"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </nav>
            
            {/* Mobile Footer */}
            <div className="mt-auto p-10 flex flex-col gap-2">
              <p className="text-[10px] font-bold text-foreground/60 tracking-widest uppercase mb-2">Socials</p>
              <div className="flex gap-4">
                {["Instagram", "Twitter", "LinkedIn"].map(s => (
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
