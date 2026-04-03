"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, CheckCircle, ShieldCheck, Target } from "lucide-react";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, ease: "easeOut", delay },
});

// 3-col section header — matches Interias exactly
function SectionHeader({ label, heading, right }: { label: string; heading: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "180px 1fr 1fr", gap: "32px",
      padding: "56px 0 48px", borderBottom: "1px solid #e0e0e0",
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
        <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#111", flexShrink: 0, marginTop: "5px", display: "block" }} />
        <span style={{ fontFamily: "'Satoshi', sans-serif", fontWeight: 500, fontSize: "13px", color: "#111" }}>{label}</span>
      </div>
      <h2 style={{ fontFamily: "'Satoshi', sans-serif", fontWeight: 700, fontSize: "clamp(1.4rem, 2.5vw, 2.1rem)", lineHeight: 1.15, letterSpacing: "-0.025em", color: "#111", margin: 0 }}>
        {heading}
      </h2>
      <div>{right}</div>
    </div>
  );
}

const values = [
  { title: "Our Case", desc: "Crafting beautiful spaces that reflect your personality and your story.", icon: ShieldCheck },
  { title: "Our Vision", desc: "To be the benchmark for excellence in high-end interior design globally.", icon: Target },
  { title: "Commitment", desc: "We deliver on time, every time, with zero compromises on quality.", icon: CheckCircle },
];

const milestones = [
  { year: "2010", title: "Studio Founded", desc: "EMPC-AMANI begins with a small team and a bold design vision.", images: ["/images/hero.png", "/images/project1.png"] },
  { year: "2015", title: "Creative Growth", desc: "Expanded into commercial and hospitality design projects worldwide.", images: ["/images/project2.png", "/images/hero.png"] },
  { year: "2020", title: "Global Reach", desc: "Started delivering projects across three continents seamlessly.", images: ["/images/project1.png", "/images/project2.png"] },
  { year: "Now", title: "New Chapter", desc: "Leading luxury design with an innovative, human-centred approach.", images: ["/images/hero.png", "/images/project1.png"] },
];

const awards = [
  { num: "01", title: "Design Excellence Award", org: "Architecture Today", year: "2023" },
  { num: "02", title: "Creative Business Design Award", org: "Design Week", year: "2022" },
  { num: "03", title: "Innovation in Design Award", org: "Interior Design Mag", year: "2021" },
];

const team = [
  { name: "Amani", role: "Principal Designer", image: "/images/hero.png" },
  { name: "Marco Silva", role: "Architect", image: "/images/project1.png" },
  { name: "Elena Park", role: "Project Manager", image: "/images/project2.png" },
  { name: "Justin Brown", role: "Lead Stylist", image: "/images/hero.png" },
];

const clients = ["DXB", "FABBRO", "LUXE.LAB", "Georg Jensen", "OSSIO", "ARTEK"];

export default function About() {
  return (
    <div style={{ fontFamily: "'Satoshi', sans-serif", background: "#f0f0f0" }}>

      {/* ── HERO ── */}
      <section style={{ position: "relative", height: "52vh", minHeight: "320px", overflow: "hidden" }}>
        <Image src="/images/hero.png" alt="About Us" fill sizes="100vw" priority style={{ objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)" }} />
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          padding: "40px 48px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "32px",
        }}>
          <h1 style={{ fontWeight: 800, fontSize: "clamp(2.5rem, 6vw, 5rem)", letterSpacing: "-0.04em", lineHeight: 1, color: "#fff", margin: 0 }}>
            About Us
          </h1>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "14px", lineHeight: 1.65, maxWidth: "320px", margin: 0 }}>
            Discover the story of our studio where passion meets purpose and values.
          </p>
        </div>
      </section>

      {/* ── INTRO ── */}
      <section>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 48px" }}>
          <div style={{ padding: "64px 0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "64px", alignItems: "flex-start", borderBottom: "1px solid #e0e0e0" }}>
            <motion.div {...fade()} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <h2 style={{ fontWeight: 700, fontSize: "clamp(1.6rem, 3vw, 2.5rem)", lineHeight: 1.15, letterSpacing: "-0.025em", margin: 0 }}>
                Rooted in Clear Vision. Driven by Detail.
              </h2>
              <p style={{ color: "#555", fontSize: "14px", lineHeight: 1.8, margin: 0 }}>
                Since day one, we&#39;ve believed that spaces and people shape each other.
                What started as a small design studio has grown into a full-service interior
                design firm. EMPC-AMANI crafts interiors that are deeply personal, functional,
                and beautifully executed from concept to completion.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px", paddingTop: "24px", borderTop: "1px solid #e0e0e0" }}>
                <div>
                  <p style={{ fontWeight: 800, fontSize: "2.2rem", letterSpacing: "-0.04em", margin: 0 }}>120+</p>
                  <p style={{ color: "#888", fontSize: "10px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginTop: "4px" }}>Happy Customers</p>
                </div>
                <div>
                  <p style={{ fontWeight: 800, fontSize: "2.2rem", letterSpacing: "-0.04em", margin: 0 }}>2,000+</p>
                  <p style={{ color: "#888", fontSize: "10px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginTop: "4px" }}>Sq Ft Designed</p>
                </div>
              </div>
            </motion.div>
            <motion.div {...fade(0.1)} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div style={{ position: "relative", borderRadius: "16px", overflow: "hidden", aspectRatio: "3/4" }}>
                <Image src="/images/project1.png" alt="Detail" fill sizes="20vw" style={{ objectFit: "cover" }} />
              </div>
              <div style={{ position: "relative", borderRadius: "16px", overflow: "hidden", aspectRatio: "3/4" }}>
                <Image src="/images/project2.png" alt="Space" fill sizes="20vw" style={{ objectFit: "cover" }} />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── OUR CLIENTS ── */}
      <section>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 48px" }}>
          <div style={{ padding: "40px 0", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "16px", borderBottom: "1px solid #e0e0e0" }}>
            <span style={{ fontWeight: 500, fontSize: "13px", color: "#888" }}>Our Clients</span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "40px", alignItems: "center" }}>
              {clients.map((c) => (
                <span key={c} style={{ fontWeight: 700, fontSize: "0.9rem", color: "#aaa", letterSpacing: "0.04em" }}>{c}</span>
              ))}
            </div>
            <Link href="/projects" style={{ fontWeight: 700, fontSize: "12px", color: "#888", textDecoration: "none", display: "flex", alignItems: "center", gap: "4px" }}>
              All Projects <ArrowUpRight size={12} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 48px" }}>
          <SectionHeader
            label="Values"
            heading={<>Driven by purpose<br />&amp; principles.</>}
            right={<p style={{ fontSize: "14px", color: "#666", lineHeight: 1.65, margin: 0 }}>Our core values define every project we undertake from day one.</p>}
          />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px", paddingTop: "40px", paddingBottom: "64px" }}>
            {values.map((v, i) => (
              <motion.div key={i} {...fade(i * 0.08)} style={{ background: "white", borderRadius: "20px", padding: "28px", display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ height: "44px", width: "44px", borderRadius: "12px", background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <v.icon size={20} color="#111" />
                </div>
                <p style={{ fontWeight: 700, fontSize: "1rem", margin: 0 }}>{v.title}</p>
                <p style={{ color: "#666", fontSize: "13px", lineHeight: 1.7, margin: 0 }}>{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 48px" }}>
          <SectionHeader
            label="History"
            heading={<>A Clear, Thoughtful<br />Design Journey</>}
            right={<p style={{ fontSize: "14px", color: "#666", lineHeight: 1.65, margin: 0 }}>From our founding to today, each chapter has shaped who we are.</p>}
          />
          <div style={{ paddingTop: "32px", paddingBottom: "64px", display: "flex", flexDirection: "column", gap: "0" }}>
            {milestones.map((m, i) => (
              <motion.div key={i} {...fade(i * 0.06)}
                style={{ display: "grid", gridTemplateColumns: "80px 1fr 1fr", gap: "32px", alignItems: "center", padding: "36px 0", borderBottom: "1px solid #e0e0e0" }}>
                <p style={{ fontWeight: 700, fontSize: "12px", color: "#888", letterSpacing: "0.04em", margin: 0 }}>{m.year}</p>
                <div>
                  <p style={{ fontWeight: 700, fontSize: "1.05rem", margin: "0 0 8px" }}>{m.title}</p>
                  <p style={{ color: "#666", fontSize: "13px", lineHeight: 1.65, margin: 0 }}>{m.desc}</p>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  {m.images.map((img, j) => (
                    <div key={j} style={{ position: "relative", borderRadius: "12px", overflow: "hidden", aspectRatio: "4/3" }}>
                      <Image src={img} alt={m.title} fill sizes="15vw" style={{ objectFit: "cover" }} />
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RECOGNITION ── */}
      <section>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 48px" }}>
          <SectionHeader
            label="Recognition"
            heading={<>Recognized Craft.<br />Celebrated Creativity.</>}
            right={<p style={{ fontSize: "14px", color: "#666", lineHeight: 1.65, margin: 0 }}>Our work has been recognized by leading design institutions worldwide.</p>}
          />
          <div style={{ paddingTop: "8px", paddingBottom: "64px" }}>
            {awards.map((a, i) => (
              <motion.div key={i} {...fade(i * 0.06)}
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 0", borderBottom: "1px solid #e0e0e0" }}>
                <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                  <span style={{ color: "#ccc", fontWeight: 700, fontSize: "13px", minWidth: "28px" }}>{a.num}</span>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: "0.95rem", margin: 0 }}>{a.title}</p>
                    <p style={{ color: "#888", fontSize: "12px", margin: "3px 0 0" }}>{a.org}</p>
                  </div>
                </div>
                <span style={{ color: "#aaa", fontSize: "13px", fontWeight: 600 }}>{a.year}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 48px" }}>
          <SectionHeader
            label="Our People"
            heading={<>Collaborative Spirit,<br />Collective Vision.</>}
            right={<p style={{ fontSize: "14px", color: "#666", lineHeight: 1.65, margin: 0 }}>Meet the talented designers and architects behind EMPC-AMANI.</p>}
          />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", paddingTop: "40px", paddingBottom: "80px" }}>
            {team.map((t, i) => (
              <motion.div key={i} {...fade(i * 0.07)} style={{ display: "flex", flexDirection: "column", gap: "12px" }}
                className="group">
                <div style={{ position: "relative", borderRadius: "16px", overflow: "hidden", aspectRatio: "3/4", filter: "grayscale(1)", transition: "filter 0.6s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.filter = "grayscale(0)")}
                  onMouseLeave={(e) => (e.currentTarget.style.filter = "grayscale(1)")}>
                  <Image src={t.image} alt={t.name} fill sizes="(max-width:768px) 50vw, 25vw" style={{ objectFit: "cover" }} />
                </div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: "0.95rem", margin: 0 }}>{t.name}</p>
                  <p style={{ color: "#888", fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", margin: "3px 0 0" }}>{t.role}</p>
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
              <Image src="/images/project2.png" alt="CTA" fill sizes="50vw" style={{ objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)" }} />
              <p style={{ position: "absolute", bottom: "20px", left: "20px", color: "#fff", fontWeight: 700, fontSize: "1rem", margin: 0 }}>Step Into Your Dream Space</p>
            </div>
            <div style={{ background: "white", borderRadius: "20px", padding: "40px", display: "flex", flexDirection: "column", gap: "20px", justifyContent: "center" }}>
              <p style={{ color: "#888", fontSize: "11px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", margin: 0 }}>Let&apos;s create</p>
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
