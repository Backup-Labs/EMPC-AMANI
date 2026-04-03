"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const navLinks = [
  { name: "About", href: "/about" },
  { name: "Projects", href: "/projects" },
  { name: "Services", href: "/services" },
  { name: "Blogs", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isHero, setIsHero] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => {
      const y = window.scrollY;
      setScrolled(y > 60);
      setIsHero(y < 80);
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
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        {/* Transparent bar that morphs into a pill on scroll */}
        <div
          className="transition-all duration-500"
          style={{
            margin: scrolled ? "12px auto" : "0 auto",
            maxWidth: scrolled ? "780px" : "100%",
            padding: scrolled ? "0 8px" : "0",
          }}
        >
          <div
            className="flex items-center justify-between transition-all duration-500"
            style={{
              background: scrolled ? "rgba(255,255,255,0.95)" : "transparent",
              backdropFilter: scrolled ? "blur(20px)" : "none",
              WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
              borderRadius: scrolled ? "999px" : "0",
              padding: scrolled ? "10px 20px 10px 16px" : "18px 40px",
              boxShadow: scrolled ? "0 2px 24px rgba(0,0,0,0.10)" : "none",
            }}
          >
            {/* Logo */}
            <Link
              href="/"
              style={{
                fontFamily: "'Satoshi', sans-serif",
                fontWeight: 800,
                fontSize: scrolled ? "15px" : "17px",
                color: scrolled ? "#111" : "#fff",
                letterSpacing: "-0.02em",
                transition: "all 0.3s",
                textDecoration: "none",
              }}
            >
              EMPC-AMANI
            </Link>

            {/* Desktop links */}
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    style={{
                      fontFamily: "'Satoshi', sans-serif",
                      fontWeight: active ? 700 : 400,
                      fontSize: "14px",
                      color: scrolled ? (active ? "#111" : "#444") : "#fff",
                      textDecoration: "none",
                      transition: "color 0.3s",
                    }}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Mobile hamburger */}
            <button
              className="flex md:hidden items-center justify-center"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              style={{ color: scrolled ? "#111" : "#fff" }}
            >
              <Menu size={22} />
            </button>
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
            transition={{ type: "spring", damping: 28, stiffness: 250 }}
            className="fixed inset-0 z-[100] flex flex-col bg-white px-8 py-10"
          >
            <div className="flex items-center justify-between mb-14">
              <span style={{ fontFamily: "'Satoshi', sans-serif", fontWeight: 800, fontSize: "17px" }}>
                EMPC-AMANI
              </span>
              <button
                onClick={() => setMobileOpen(false)}
                className="h-10 w-10 flex items-center justify-center rounded-full"
                style={{ background: "#f0f0f0" }}
              >
                <X size={18} />
              </button>
            </div>
            <nav className="flex flex-col gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    fontFamily: "'Satoshi', sans-serif",
                    fontWeight: 700,
                    fontSize: "2.2rem",
                    color: "#111",
                    textDecoration: "none",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
