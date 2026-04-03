"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";

// ─── DATA ────────────────────────────────────────────────────────────────────

const exclusiveProjects = [
  { title: "Coastal Serenity", category: "Residential", year: "2024", image: "/images/hero.png" },
  { title: "Azure Hallway", category: "Commercial", year: "2025", image: "/images/project1.png" },
  { title: "Urban Tranquility", category: "Hospitality", year: "2024", image: "/images/project2.png" },
];

const featuredProjects = [
  { title: "Nordic Light Loft", tags: ["Scandinavian", "Functional Elegance"], image: "/images/hero.png" },
  { title: "Redwood Horizon", tags: ["Timber Architecture", "Nature Immersion"], image: "/images/project1.png" },
  { title: "Atelier Noir", tags: ["Monochrome", "Industrial Chic"], image: "/images/project2.png" },
];

// Shared section-label row (3 columns)
function SectionHeader({ label, heading, desc, rightEl }: { label: string; heading: React.ReactNode; desc?: string; rightEl?: React.ReactNode }) {
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "180px 1fr 1fr", gap: "32px",
      padding: "56px 0 48px", borderBottom: "1px solid #e0e0e0",
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: "8px", paddingTop: "4px" }}>
        <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#111", flexShrink: 0, marginTop: "5px", display: "block" }} />
        <span style={{ fontFamily: "'Satoshi', sans-serif", fontWeight: 500, fontSize: "13px", color: "#111" }}>{label}</span>
      </div>
      <div>
        <h2 style={{ fontFamily: "'Satoshi', sans-serif", fontWeight: 700, fontSize: "clamp(1.5rem, 2.5vw, 2.2rem)", lineHeight: 1.15, letterSpacing: "-0.025em", color: "#111", margin: 0 }}>
          {heading}
        </h2>
      </div>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        {desc && <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: "14px", color: "#666", lineHeight: 1.65, margin: 0 }}>{desc}</p>}
        {rightEl}
      </div>
    </div>
  );
}

// ─── CAROUSEL ────────────────────────────────────────────────────────────────

function Carousel({ items }: { items: typeof exclusiveProjects }) {
  const [idx, setIdx] = useState(0);
  const prev = () => setIdx((i) => (i - 1 + items.length) % items.length);
  const next = () => setIdx((i) => (i + 1) % items.length);
  const item = items[idx];

  return (
    <div>
      <motion.div
        key={idx}
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        style={{ position: "relative", borderRadius: "20px", overflow: "hidden", aspectRatio: "16/9" }}
      >
        <Image src={item.image} alt={item.title} fill sizes="(max-width:768px) 100vw, 80vw" className="object-cover" />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)" }} />
        <div style={{ position: "absolute", bottom: "28px", left: "28px" }}>
          <p style={{ fontFamily: "'Satoshi', sans-serif", fontWeight: 700, fontSize: "1.4rem", color: "#fff", margin: 0 }}>{item.title}</p>
          <p style={{ fontFamily: "'Satoshi', sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.6)", margin: "4px 0 0" }}>{item.category} · {item.year}</p>
        </div>
      </motion.div>
    </div>
  );
}

// ─── PAGE ────────────────────────────────────────────────────────────────────

export default function Home() {
  const [carouselIdx, setCarouselIdx] = useState(0);
  const prevSlide = () => setCarouselIdx((i) => (i - 1 + exclusiveProjects.length) % exclusiveProjects.length);
  const nextSlide = () => setCarouselIdx((i) => (i + 1) % exclusiveProjects.length);
  const slide = exclusiveProjects[carouselIdx];

  return (
    <div style={{ fontFamily: "'Satoshi', sans-serif", background: "#fff" }}>

      {/* ── HERO ── */}
      <section style={{ position: "relative", height: "100vh", minHeight: "600px", overflow: "hidden" }}>
        <Image src="/images/hero.png" alt="EMPC-AMANI Interior" fill priority sizes="100vw" style={{ objectFit: "cover" }} />
        {/* Gradient overlay */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0.35) 100%)" }} />

        {/* Bottom text */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "48px 48px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "32px" }}>
          <div>
            <h1 style={{ fontWeight: 800, fontSize: "clamp(2.5rem, 5vw, 5rem)", lineHeight: 1.05, letterSpacing: "-0.03em", color: "#fff", margin: 0, maxWidth: "640px" }}>
              Where Aesthetics Meet<br />Purposeful Living
            </h1>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "15px", lineHeight: 1.65, marginTop: "16px", maxWidth: "480px" }}>
              We create interiors that blend timeless elegance with modern functionality,
              reflecting your story and lifestyle. Let's build something beautiful together.
            </p>
          </div>

          {/* Floating project card */}
          <Link href="/projects" style={{ textDecoration: "none", flexShrink: 0 }}>
            <div style={{
              background: "rgba(255,255,255,0.18)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
              border: "1px solid rgba(255,255,255,0.3)", borderRadius: "16px", overflow: "hidden",
              width: "220px",
            }}>
              <div style={{ position: "relative", height: "130px" }}>
                <Image src="/images/project1.png" alt="Azure Hallway" fill sizes="220px" style={{ objectFit: "cover" }} />
              </div>
              <div style={{ padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 700, fontSize: "13px", color: "#fff" }}>Azure Hallway</span>
                <ArrowUpRight size={16} color="white" />
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* ── STUDIO SECTION ── */}
      <section style={{ background: "#f0f0f0" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 48px" }}>
          <SectionHeader
            label="Studio"
            heading={<>Rooted in Clear Vision.<br />Driven by Detail.</>}
            desc="Our design philosophy blends story, structure, and soul to craft environments."
            rightEl={
              <Link href="/about" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontWeight: 700, fontSize: "14px", color: "#111", textDecoration: "none", marginTop: "12px" }}>
                About Us <ArrowUpRight size={14} />
              </Link>
            }
          />
        </div>
      </section>

      {/* ── FULL-WIDTH IMAGE + STATS ── */}
      <section style={{ background: "#f0f0f0" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 48px 56px" }}>
          {/* Full-width rounded image */}
          <div style={{ position: "relative", borderRadius: "20px", overflow: "hidden", aspectRatio: "16/8", marginBottom: "48px" }}>
            <Image src="/images/project2.png" alt="Studio" fill sizes="(max-width:1280px) 100vw, 1280px" style={{ objectFit: "cover" }} />
          </div>

          {/* Stats row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "32px" }}>
            {[
              { val: "46+", label: "Homes transformed", desc: "From apartments to luxurious villas, each project is a unique story of style." },
              { val: "29+", label: "Commercial spaces", desc: "Innovative designs that enhance functionality while maintaining aesthetic." },
              { val: "756+", label: "Satisfied Clients", desc: "Whether a homeowner or investor, our clients celebrate every transformation." },
            ].map((s, i) => (
              <div key={i}>
                <p style={{ fontWeight: 800, fontSize: "2.8rem", letterSpacing: "-0.04em", color: "#666", margin: 0 }}>{s.val}</p>
                <p style={{ fontWeight: 700, fontSize: "14px", color: "#111", margin: "4px 0 8px" }}>{s.label}</p>
                <p style={{ fontSize: "13px", color: "#666", lineHeight: 1.65, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EXCLUSIVE PROJECTS (carousel) ── */}
      <section style={{ background: "#f0f0f0" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 48px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "180px 1fr 1fr", gap: "32px", padding: "56px 0 48px", borderBottom: "1px solid #e0e0e0" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#111", flexShrink: 0, marginTop: "5px", display: "block" }} />
              <span style={{ fontFamily: "'Satoshi', sans-serif", fontWeight: 500, fontSize: "13px", color: "#111" }}>Exclusive Projects</span>
            </div>
            <h2 style={{ fontWeight: 700, fontSize: "clamp(1.5rem, 2.5vw, 2.2rem)", lineHeight: 1.15, letterSpacing: "-0.025em", color: "#111", margin: 0 }}>
              Boldly Rooted in Vision.<br />Exclusive In Execution.
            </h2>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <p style={{ fontSize: "14px", color: "#666", lineHeight: 1.65, margin: 0 }}>A visual library of interiors brought to life from blueprint to beauty.</p>
              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                <button onClick={prevSlide} style={{ height: "40px", width: "40px", borderRadius: "50%", background: "#111", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <ChevronLeft size={18} color="white" />
                </button>
                <button onClick={nextSlide} style={{ height: "40px", width: "40px", borderRadius: "50%", background: "#111", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <ChevronRight size={18} color="white" />
                </button>
              </div>
            </div>
          </div>

          {/* carousel image */}
          <div style={{ paddingTop: "32px", paddingBottom: "56px" }}>
            <motion.div
              key={carouselIdx}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              style={{ position: "relative", borderRadius: "20px", overflow: "hidden", aspectRatio: "16/8" }}
            >
              <Image src={slide.image} alt={slide.title} fill sizes="(max-width:1280px) 100vw, 1104px" style={{ objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)" }} />
              <div style={{ position: "absolute", bottom: "28px", left: "28px" }}>
                <p style={{ fontWeight: 700, fontSize: "1.3rem", color: "#fff", margin: 0 }}>{slide.title}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FEATURED PROJECTS (3-col grid) ── */}
      <section style={{ background: "#f0f0f0" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 48px" }}>
          <SectionHeader
            label="Featured Projects"
            heading={<>Spaces That Inspire.<br />Projects That Last.</>}
            desc="Discover our range of interior designs that turn ideas into stunning spaces!"
          />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px", paddingTop: "40px", paddingBottom: "80px" }}>
            {featuredProjects.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                style={{ display: "flex", flexDirection: "column", gap: "12px" }}
              >
                <div style={{ position: "relative", borderRadius: "16px", overflow: "hidden", aspectRatio: "1 / 1" }}>
                  <Image src={p.image} alt={p.title} fill sizes="(max-width:768px) 100vw, 33vw" style={{ objectFit: "cover", transition: "transform 0.6s ease" }}
                    className="group-hover:scale-105"
                  />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: "1rem", margin: "0 0 8px", color: "#111" }}>{p.title}</p>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      {p.tags.map((tag) => (
                        <span key={tag} style={{
                          fontSize: "11px", fontWeight: 500, color: "#444",
                          border: "1px solid #c0c0c0", borderRadius: "999px", padding: "3px 10px",
                        }}>{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div style={{ height: "32px", width: "32px", borderRadius: "50%", border: "1px solid #c0c0c0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <ArrowUpRight size={14} color="#444" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BLOG STRIP ── */}
      <section style={{ background: "#f0f0f0" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 48px 80px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "32px", borderBottom: "1px solid #e0e0e0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#111", display: "block" }} />
              <span style={{ fontWeight: 500, fontSize: "13px", color: "#111" }}>Latest Blogs</span>
            </div>
            <Link href="/blog" style={{ fontWeight: 700, fontSize: "13px", color: "#111", textDecoration: "none", display: "flex", alignItems: "center", gap: "4px" }}>
              View All <ArrowUpRight size={13} />
            </Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "32px", paddingTop: "36px" }}>
            {[
              { title: "The Future of Sustainable Design", date: "Mar 20, 2026", image: "/images/hero.png" },
              { title: "Minimalism vs. Maximalism in 2026", date: "Mar 15, 2026", image: "/images/project1.png" },
              { title: "Color Psychology in Workspaces", date: "Mar 10, 2026", image: "/images/project2.png" },
            ].map((b, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.07 }}>
                <div style={{ position: "relative", borderRadius: "14px", overflow: "hidden", aspectRatio: "16/10", marginBottom: "14px" }}>
                  <Image src={b.image} alt={b.title} fill sizes="33vw" style={{ objectFit: "cover" }} />
                </div>
                <p style={{ fontSize: "11px", color: "#888", margin: "0 0 6px", fontWeight: 500 }}>{b.date}</p>
                <p style={{ fontWeight: 700, fontSize: "0.95rem", color: "#111", margin: 0, lineHeight: 1.4 }}>{b.title}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
