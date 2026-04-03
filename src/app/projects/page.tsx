"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";

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

const exclusiveProjects = [
  { title: "Coastal Serenity", category: "Residential", year: "2024", image: "/images/hero.png" },
  { title: "Azure Hallway", category: "Commercial", year: "2025", image: "/images/project1.png" },
  { title: "Urban Tranquility", category: "Hospitality", year: "2024", image: "/images/project2.png" },
];

const featuredProjects = [
  { title: "Nordic Light Loft", tags: ["Scandinavian", "Functional Elegance"], image: "/images/hero.png" },
  { title: "Redwood Horizon", tags: ["Timber Architecture", "Nature Immersion"], image: "/images/project1.png" },
  { title: "Atelier Noir", tags: ["Monochrome", "Industrial Chic"], image: "/images/project2.png" },
  { title: "Noir Culture Studio", tags: ["Studio", "New Transition"], image: "/images/hero.png" },
  { title: "Maison Éclat Studio", tags: ["Apartment", "Interior Design"], image: "/images/project1.png" },
];

export default function Projects() {
  const [idx, setIdx] = useState(0);
  const prev = () => setIdx((i) => (i - 1 + exclusiveProjects.length) % exclusiveProjects.length);
  const next = () => setIdx((i) => (i + 1) % exclusiveProjects.length);
  const slide = exclusiveProjects[idx];

  return (
    <div style={{ fontFamily: "'Satoshi', sans-serif", background: "#f0f0f0" }}>

      {/* ── HERO ── */}
      <section style={{ position: "relative", height: "52vh", minHeight: "320px", overflow: "hidden" }}>
        <Image src="/images/project1.png" alt="Projects" fill sizes="100vw" priority style={{ objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.52)" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "40px 48px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "32px" }}>
          <h1 style={{ fontWeight: 800, fontSize: "clamp(2.5rem, 6vw, 5rem)", letterSpacing: "-0.04em", lineHeight: 1, color: "#fff", margin: 0 }}>
            Projects
          </h1>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "14px", lineHeight: 1.65, maxWidth: "280px", margin: 0 }}>
            From a small beginning to a bold vision, we design spaces that shape lives.
          </p>
        </div>
      </section>

      {/* ── EXCLUSIVE PROJECTS ── */}
      <section>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 48px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "180px 1fr 1fr", gap: "32px", padding: "56px 0 48px", borderBottom: "1px solid #e0e0e0" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#111", flexShrink: 0, marginTop: "5px", display: "block" }} />
              <span style={{ fontWeight: 500, fontSize: "13px", color: "#111" }}>Exclusive Projects</span>
            </div>
            <h2 style={{ fontWeight: 700, fontSize: "clamp(1.4rem, 2.5vw, 2.1rem)", lineHeight: 1.15, letterSpacing: "-0.025em", margin: 0 }}>
              Boldly Rooted in Vision.<br />Exclusive In Execution.
            </h2>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <p style={{ fontSize: "14px", color: "#666", lineHeight: 1.65, margin: 0 }}>
                A visual library of interiors brought to life from blueprint to beauty.
              </p>
              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "16px" }}>
                <button onClick={prev} style={{ height: "40px", width: "40px", borderRadius: "50%", background: "#111", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <ChevronLeft size={18} color="white" />
                </button>
                <button onClick={next} style={{ height: "40px", width: "40px", borderRadius: "50%", background: "#111", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <ChevronRight size={18} color="white" />
                </button>
              </div>
            </div>
          </div>

          {/* Carousel */}
          <div style={{ paddingTop: "32px", paddingBottom: "64px" }}>
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              style={{ position: "relative", borderRadius: "20px", overflow: "hidden", aspectRatio: "16/8" }}
            >
              <Image src={slide.image} alt={slide.title} fill sizes="(max-width:1280px) 100vw, 1184px" style={{ objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)" }} />
              <div style={{ position: "absolute", bottom: "28px", left: "28px" }}>
                <p style={{ fontWeight: 700, fontSize: "1.3rem", color: "#fff", margin: 0 }}>{slide.title}</p>
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)", margin: "4px 0 0" }}>{slide.category} · {slide.year}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FEATURED PROJECTS ── */}
      <section>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 48px" }}>
          <SectionHeader
            label="Featured Projects"
            heading={<>Spaces That Inspire.<br />Projects That Last.</>}
            right={<p style={{ fontSize: "14px", color: "#666", lineHeight: 1.65, margin: 0 }}>Discover our range of interior designs that turn ideas into stunning spaces!</p>}
          />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", paddingTop: "40px", paddingBottom: "80px" }}>
            {featuredProjects.map((p, i) => (
              <motion.div key={i} {...fade(i * 0.07)} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ position: "relative", borderRadius: "16px", overflow: "hidden", aspectRatio: "1/1" }}>
                  <Image src={p.image} alt={p.title} fill sizes="(max-width:768px) 100vw, 33vw" style={{ objectFit: "cover", transition: "transform 0.6s ease" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: "0.95rem", margin: "0 0 8px", color: "#111" }}>{p.title}</p>
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                      {p.tags.map((t) => (
                        <span key={t} style={{ fontSize: "11px", fontWeight: 500, color: "#444", border: "1px solid #c8c8c8", borderRadius: "999px", padding: "3px 10px" }}>{t}</span>
                      ))}
                    </div>
                  </div>
                  <div style={{ height: "32px", width: "32px", borderRadius: "50%", border: "1px solid #c8c8c8", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <ArrowUpRight size={14} color="#555" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
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
              <Image src="/images/hero.png" alt="CTA" fill sizes="50vw" style={{ objectFit: "cover" }} />
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
