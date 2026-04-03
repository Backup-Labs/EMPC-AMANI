"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Calendar, User } from "lucide-react";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.45, ease: "easeOut", delay },
});

const posts = [
  {
    title: "The Future of Sustainable Interior Design",
    excerpt: "Exploring how eco-friendly materials are reshaping the modern home aesthetic in transformative ways.",
    date: "March 20, 2026",
    author: "Amani",
    category: "Sustainability",
    image: "/images/hero.png",
  },
  {
    title: "Minimalism vs. Maximalism in 2026",
    excerpt: "Which trend is right for your space? We deep dive into the pros and cons of both approaches.",
    date: "March 15, 2026",
    author: "Elena",
    category: "Trends",
    image: "/images/project1.png",
  },
  {
    title: "Color Psychology in Workspaces",
    excerpt: "How the right palette can boost team productivity and support mental well-being significantly.",
    date: "March 10, 2026",
    author: "Marco",
    category: "Psychology",
    image: "/images/project2.png",
  },
  {
    title: "Biophilic Design: Bringing Nature Indoors",
    excerpt: "Why incorporating natural elements into your interior design improves mood, health and creativity.",
    date: "March 5, 2026",
    author: "Amani",
    category: "Biophilic",
    image: "/images/hero.png",
  },
  {
    title: "How to Style a Small Living Room",
    excerpt: "Clever design strategies that make even the most compact spaces feel open, airy and inviting.",
    date: "Feb 28, 2026",
    author: "Elena",
    category: "Tips",
    image: "/images/project1.png",
  },
  {
    title: "The Art of Layering Textures",
    excerpt: "Master the craft of combining textiles, metals, and natural materials for tactile-rich interiors.",
    date: "Feb 20, 2026",
    author: "Marco",
    category: "Styling",
    image: "/images/project2.png",
  },
];

export default function Blog() {
  return (
    <div style={{ fontFamily: "'Satoshi', sans-serif", background: "#f0f0f0" }}>

      {/* ── HERO ── */}
      <section style={{ background: "#111", paddingTop: "120px", paddingBottom: "64px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 48px" }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#777", display: "block" }} />
              <span style={{ fontWeight: 500, fontSize: "13px", color: "#777" }}>Our Blog</span>
            </div>
            <h1 style={{ fontWeight: 800, fontSize: "clamp(2.5rem, 6vw, 5rem)", letterSpacing: "-0.04em", lineHeight: 1, color: "#fff", margin: "0 0 16px" }}>
              Insights &amp;<br />Inspiration.
            </h1>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "14px", lineHeight: 1.7, margin: 0, maxWidth: "380px" }}>
              Design insights, trends, and inspiration from the studio of EMPC-AMANI.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── BLOG GRID ── */}
      <section>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "64px 48px 80px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "32px" }}>
            {posts.map((post, i) => (
              <motion.article key={i} {...fade(i * 0.06)} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {/* Image */}
                <Link href={`/blog/${post.title.toLowerCase().replace(/ /g, "-")}`} style={{ position: "relative", borderRadius: "16px", overflow: "hidden", aspectRatio: "16/10", display: "block" }}>
                  <Image src={post.image} alt={post.title} fill sizes="(max-width:768px) 100vw, 33vw" style={{ objectFit: "cover", transition: "transform 0.6s ease" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1.05)")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1)")}
                  />
                  <div style={{ position: "absolute", top: "12px", left: "12px", background: "rgba(0,0,0,0.52)", backdropFilter: "blur(8px)", borderRadius: "999px", padding: "4px 12px" }}>
                    <span style={{ color: "#fff", fontSize: "10px", fontWeight: 600, letterSpacing: "0.06em" }}>{post.category}</span>
                  </div>
                </Link>
                {/* Meta */}
                <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                  <span style={{ color: "#888", fontSize: "11px", display: "flex", alignItems: "center", gap: "4px" }}>
                    <Calendar size={11} /> {post.date}
                  </span>
                  <span style={{ color: "#888", fontSize: "11px", display: "flex", alignItems: "center", gap: "4px" }}>
                    <User size={11} /> {post.author}
                  </span>
                </div>
                {/* Text */}
                <Link href={`/blog/${post.title.toLowerCase().replace(/ /g, "-")}`} style={{ textDecoration: "none" }}>
                  <h2 style={{ fontWeight: 700, fontSize: "1rem", lineHeight: 1.4, letterSpacing: "-0.01em", color: "#111", margin: 0 }}>
                    {post.title}
                  </h2>
                </Link>
                <p style={{ color: "#666", fontSize: "13px", lineHeight: 1.7, margin: 0 }}>{post.excerpt}</p>
                <Link href={`/blog/${post.title.toLowerCase().replace(/ /g, "-")}`} style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontWeight: 700, fontSize: "12px", color: "#111", textDecoration: "underline", textUnderlineOffset: "4px" }}>
                  Read More <ArrowUpRight size={12} />
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
