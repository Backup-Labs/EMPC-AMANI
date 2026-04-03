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
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);
const IconFacebook = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);
const IconX = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4l11.733 16h4.267l-11.733-16zM4 20l6.768-6.768m2.46-2.46L20 4" />
  </svg>
);
const IconWhatsApp = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

export function Footer() {
  return (
    <footer style={{ background: "#111111", position: "relative", overflow: "hidden" }}>
      {/* Subtle radial glow */}
      <div style={{
        position: "absolute", bottom: 0, left: "20%",
        width: "500px", height: "260px", pointerEvents: "none",
        background: "radial-gradient(ellipse at center, rgba(255,255,255,0.04) 0%, transparent 70%)",
        filter: "blur(40px)",
      }} />

      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "60px 48px 32px", position: "relative", zIndex: 1 }}>
        {/* Top row */}
        <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
          {/* Nav + Socials (right aligned) */}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", alignItems: "flex-end" }}>
              {/* Nav links */}
              <div style={{ display: "flex", gap: "32px", flexWrap: "wrap", justifyContent: "flex-end" }}>
                {navLinks.map((l) => (
                  <Link key={l.name} href={l.href} style={{
                    fontFamily: "'Satoshi', sans-serif", fontWeight: 400, fontSize: "13px",
                    color: "rgba(255,255,255,0.55)", textDecoration: "none",
                  }}>{l.name}</Link>
                ))}
              </div>
              {/* Social icons */}
              <div style={{ display: "flex", gap: "10px" }}>
                {[
                  { Icon: IconInstagram, label: "Instagram" },
                  { Icon: IconFacebook, label: "Facebook" },
                  { Icon: IconX, label: "X" },
                  { Icon: IconWhatsApp, label: "WhatsApp" },
                ].map(({ Icon, label }) => (
                  <Link key={label} href="#" aria-label={label} style={{
                    height: "36px", width: "36px", borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "rgba(255,255,255,0.45)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    textDecoration: "none",
                    transition: "all 0.2s",
                  }}>
                    <Icon />
                  </Link>
                ))}
              </div>
              {/* Terms */}
              <div style={{ display: "flex", gap: "20px" }}>
                <Link href="#" style={{ fontFamily: "'Satoshi', sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.3)", textDecoration: "none" }}>Terms &amp; Condition</Link>
                <Link href="#" style={{ fontFamily: "'Satoshi', sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.3)", textDecoration: "none" }}>Privacy Policy</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Huge brand name */}
        <div style={{ marginTop: "40px", marginBottom: "32px" }}>
          <span style={{
            fontFamily: "'Satoshi', sans-serif",
            fontWeight: 900,
            fontSize: "clamp(3.5rem, 12vw, 10rem)",
            lineHeight: 0.9,
            letterSpacing: "-0.04em",
            color: "white",
            display: "block",
            userSelect: "none",
          }}>
            EMPC-AMANI
          </span>
        </div>

        {/* Bottom bar */}
        <div style={{
          display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "8px",
          paddingTop: "20px", borderTop: "1px solid rgba(255,255,255,0.07)",
        }}>
          <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.28)" }}>
            ©2025 All rights reserved.
          </p>
          <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.28)" }}>
            Designed by fremix.design
          </p>
        </div>
      </div>
    </footer>
  );
}
