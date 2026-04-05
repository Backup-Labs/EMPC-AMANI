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
    <footer className="bg-white relative overflow-hidden pt-32 pb-16">
      {/* Monochromatic Mirror Glow Layer */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-[radial-gradient(circle_at_100%_0%,rgba(0,0,0,0.02)_0%,transparent_70%)] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-16 md:gap-0 pb-20 border-b border-black/5">
          <div className="flex flex-col gap-8">
            <Link href="/" className="font-black text-3xl text-[#111] tracking-tighter no-underline">
              EMPC-AMANI
            </Link>
            <div className="flex flex-col gap-2">
              <p className="text-[#555] text-lg font-bold">Lane London EC1R 0BJ</p>
              <Link href="mailto:info@empc-amani.com" className="text-[#111] text-lg font-bold hover:underline">info@empc-amani.com</Link>
            </div>
          </div>

          <div className="flex flex-col gap-12 md:items-end">
            <nav className="flex flex-wrap gap-x-12 gap-y-4 justify-start md:justify-end">
              {navLinks.map((l) => (
                <Link key={l.name} href={l.href} className="text-base font-black text-[#888] no-underline hover:text-[#111] transition-colors uppercase tracking-widest">{l.name}</Link>
              ))}
            </nav>

            <div className="flex gap-4">
              {[
                { Icon: IconInstagram, label: "Instagram" },
                { Icon: IconFacebook, label: "Facebook" },
                { Icon: IconX, label: "X" },
                { Icon: IconLinkedIn, label: "LinkedIn" },
              ].map(({ Icon, label }) => (
                <Link key={label} href="#" className="h-12 w-12 rounded-full flex items-center justify-center text-[#111] border border-black/5 hover:bg-black hover:text-white transition-all transform hover:-translate-y-1 shadow-sm">
                  <Icon />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Big Brand Statement - Reduced Size */}
        <div className="py-20 lg:py-32 overflow-hidden text-center">
          <h2 className="font-black text-[12vw] lg:text-[10rem] leading-[0.75] tracking-[-0.06em] text-[#111] m-0 select-none opacity-5">
            EMPC-AMANI
          </h2>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-8">
          <div className="flex gap-10">
            <Link href="/terms" className="text-[11px] font-black text-[#aaa] uppercase tracking-[0.2em] no-underline hover:text-[#111]">Terms</Link>
            <Link href="/privacy" className="text-[11px] font-black text-[#aaa] uppercase tracking-[0.2em] no-underline hover:text-[#111]">Privacy</Link>
          </div>
          <div className="flex gap-6 items-center">
            <p className="text-[11px] font-black text-[#aaa] uppercase tracking-[0.2em]">©2026 EMPC-AMANI</p>
            <div className="h-1 w-1 rounded-full bg-[#111]" />
            <p className="text-[11px] font-black text-[#aaa] uppercase tracking-[0.2em]">London Studio</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
