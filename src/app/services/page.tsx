"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.45, ease: "easeOut", delay },
});

function SectionHeader({ label, heading, right }: { label: string; heading: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "180px 1fr 1fr", gap: "32px", padding: "56px 0 48px", borderBottom: "1px solid #e0e0e0" }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
        <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#111", flexShrink: 0, marginTop: "5px", display: "block" }} />
        <span style={{ fontFamily: "'Satoshi', sans-serif", fontWeight: 500, fontSize: "13px", color: "#111" }}>{label}</span>
      </div>
      <h2 style={{ fontFamily: "'Satoshi', sans-serif", fontWeight: 700, fontSize: "clamp(1.4rem, 2.5vw, 2.1rem)", lineHeight: 1.15, letterSpacing: "-0.025em", color: "#111", margin: 0 }}>{heading}</h2>
      <div>{right}</div>
    </div>
  );
}

const services = [
  {
    num: "(001)",
    title: "Residential Design",
    desc: "Complete home interiors that reflect your style — functional, beautiful, and deeply personal.",
    stat: "90+",
    statLabel: "Transformed Spaces",
    image: "/images/hero.png",
  },
  {
    num: "(002)",
    title: "Commercial Interior Design",
    desc: "Smart, branded spaces for offices, cafés, and retail that engage and perform.",
    stat: "40+",
    statLabel: "Transformed Spaces",
    image: "/images/project1.png",
  },
  {
    num: "(003)",
    title: "Interior Renovations",
    desc: "We rework layouts, update materials, and give tired spaces a fresh, modern edge.",
    stat: "30+",
    statLabel: "Transformed Spaces",
    image: "/images/project2.png",
  },
  {
    num: "(004)",
    title: "Styling & Decor",
    desc: "The finishing touches that complete a space — furniture, lighting, textiles, and art.",
    stat: "75+",
    statLabel: "Styled Homes",
    image: "/images/hero.png",
  },
  {
    num: "(005)",
    title: "Virtual Design",
    desc: "Full-service remote design with detailed 3D renders and guided shopping lists.",
    stat: "35+",
    statLabel: "Remote Clients",
    image: "/images/project1.png",
  },
];

export default function Services() {
  return (
    <div style={{ fontFamily: "'Satoshi', sans-serif", background: "#f0f0f0" }}>

      {/* ── HERO ── */}
      <section style={{ position: "relative", height: "52vh", minHeight: "320px", overflow: "hidden" }}>
        <Image src="/images/project2.png" alt="Our Services" fill sizes="100vw" priority style={{ objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.58)" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "40px 48px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "32px" }}>
          <h1 style={{ fontWeight: 800, fontSize: "clamp(2.5rem, 6vw, 5rem)", letterSpacing: "-0.04em", lineHeight: 1, color: "#fff", margin: 0 }}>
            Our Services
          </h1>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "14px", lineHeight: 1.65, maxWidth: "300px", margin: 0 }}>
            Explore our tailored design services crafted to reflect comfort, beauty, and purpose.
          </p>
        </div>
      </section>

      {/* ── SECTION INTRO ── */}
      <section>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 48px" }}>
          <SectionHeader
            label="Services"
            heading={<>Personalized Care.<br />Inspired Spaces.</>}
            right={<p style={{ fontSize: "14px", color: "#666", lineHeight: 1.65, margin: 0 }}>Discover our range of interior designs that turn ideas into stunning spaces!</p>}
          />
        </div>
      </section>

      {/* ── SERVICE LIST ── */}
      <section>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 48px 80px" }}>
          {services.map((s, i) => (
            <motion.div key={i} {...fade(0)}
              style={{ borderBottom: "1px solid #e0e0e0", paddingBottom: "48px", marginTop: "40px" }}>
              {/* Row: number + title/desc/stat */}
              <div style={{ display: "grid", gridTemplateColumns: "180px 1fr 1fr", gap: "32px", marginBottom: "24px" }}>
                <span style={{ fontWeight: 600, fontSize: "13px", color: "#888", paddingTop: "4px" }}>{s.num}</span>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <h3 style={{ fontWeight: 700, fontSize: "1.4rem", letterSpacing: "-0.02em", margin: 0 }}>{s.title}</h3>
                  <p style={{ color: "#666", fontSize: "13px", lineHeight: 1.75, margin: 0, maxWidth: "380px" }}>{s.desc}</p>
                  <div style={{ marginTop: "8px" }}>
                    <p style={{ fontWeight: 800, fontSize: "1.6rem", letterSpacing: "-0.04em", margin: 0 }}>{s.stat}</p>
                    <p style={{ color: "#888", fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", margin: "3px 0 0" }}>{s.statLabel}</p>
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "flex-start" }}>
                  <Link href="/contact" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontWeight: 600, fontSize: "13px", color: "#111", border: "1px solid #ccc", borderRadius: "999px", padding: "8px 18px", textDecoration: "none" }}>
                    Enquire <ArrowUpRight size={13} />
                  </Link>
                </div>
              </div>
              {/* Full-width image */}
              <div style={{ position: "relative", borderRadius: "18px", overflow: "hidden", aspectRatio: "21/9" }}>
                <Image src={s.image} alt={s.title} fill sizes="(max-width:1280px) 100vw, 1184px" style={{ objectFit: "cover", transition: "transform 0.7s ease" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1.04)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1)")}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 48px" }}>
          <SectionHeader
            label="Contact"
            heading={<>Together, We Shape<br />the Extraordinary</>}
            right={<p style={{ fontSize: "14px", color: "#666", lineHeight: 1.65, margin: 0 }}>Interested in working with us? Let&apos;s bring your space to life.</p>}
          />
          <div style={{ paddingTop: "32px", paddingBottom: "80px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div style={{ position: "relative", borderRadius: "20px", overflow: "hidden", aspectRatio: "16/10" }}>
              <Image src="/images/project1.png" alt="CTA" fill sizes="50vw" style={{ objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.32)" }} />
              <p style={{ position: "absolute", bottom: "20px", left: "20px", color: "#fff", fontWeight: 700, fontSize: "1rem", margin: 0 }}>Step Into Your Dream Space</p>
            </div>
            <div style={{ background: "white", borderRadius: "20px", padding: "40px", display: "flex", flexDirection: "column", gap: "20px", justifyContent: "center" }}>
              <p style={{ color: "#888", fontSize: "11px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", margin: 0 }}>Begin your design journey</p>
              <p style={{ fontSize: "14px", color: "#555", lineHeight: 1.75, margin: 0 }}>
                Let&apos;s create something truly incredible together. Your ideal space begins right here with us.
              </p>
              <Link href="/contact" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontWeight: 700, fontSize: "13px", color: "#111", textDecoration: "underline", textUnderlineOffset: "4px" }}>
                Contact Us <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
