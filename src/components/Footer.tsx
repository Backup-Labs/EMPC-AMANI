"use client";

import React from "react";
import Link from "next/link";

const navLinks = [
  { name: "About", href: "/about" },
  { name: "Projects", href: "/projects" },
  { name: "Services", href: "/services" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

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

export function Footer() {
  return (
    <footer className="bg-[#111111] relative overflow-hidden">
      {/* Subtle radial glow */}
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[300px] pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.05)_0%,transparent_70%)] blur-[50px] opacity-20" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 pt-20 pb-12 relative z-10">
        {/* Top Content Row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-16 md:gap-0">
          
          {/* Logo & Info */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="font-extrabold text-2xl text-white tracking-tighter no-underline">
              EMPC-AMANI
            </Link>
            <div className="flex flex-col gap-1.5">
              <p className="text-white/40 text-sm font-medium">Lane London EC1R 0BJ</p>
              <p className="text-white/40 text-sm font-medium">info@empc-amani.com</p>
            </div>
          </div>

          {/* Navigation & Socials */}
          <div className="flex flex-col gap-10 md:items-end">
            {/* Links Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-12 gap-y-4 md:flex md:gap-8">
              {navLinks.map((l) => (
                <Link key={l.name} href={l.href} className="text-[13px] font-bold text-white/50 no-underline hover:text-white transition-colors">{l.name}</Link>
              ))}
            </div>

            {/* Social Icons */}
            <div className="flex gap-3">
              {[
                { Icon: IconInstagram, label: "Instagram" },
                { Icon: IconFacebook, label: "Facebook" },
                { Icon: IconX, label: "X" },
                { Icon: IconLinkedIn, label: "LinkedIn" },
              ].map(({ Icon, label }) => (
                <Link key={label} href="#" aria-label={label} className="h-11 w-11 rounded-full flex items-center justify-center text-white/40 border border-white/10 hover:border-white/30 hover:text-white transition-all transform hover:-translate-y-1">
                  <Icon />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Big Brand Statement */}
        <div className="mt-20 md:mt-32 mb-10 overflow-hidden">
          <span className="font-black text-[12vw] lg:text-[11rem] leading-[0.85] tracking-[-0.05em] text-white select-none whitespace-nowrap md:whitespace-normal">
            EMPC-AMANI
          </span>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pt-10 border-t border-white/5">
          <div className="flex gap-8">
            <p className="text-[11px] font-bold text-white/20 uppercase tracking-widest no-underline hover:text-white/40 transition-colors cursor-pointer">Terms & Condition</p>
            <p className="text-[11px] font-bold text-white/20 uppercase tracking-widest no-underline hover:text-white/40 transition-colors cursor-pointer">Privacy Policy</p>
          </div>
          <div className="flex gap-4 items-center">
            <p className="text-[11px] font-bold text-white/20 uppercase tracking-widest">©2026 EMPC-AMANI</p>
            <span className="h-1 w-1 rounded-full bg-white/10" />
            <p className="text-[11px] font-bold text-white/20 uppercase tracking-widest">Amani Studio</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
