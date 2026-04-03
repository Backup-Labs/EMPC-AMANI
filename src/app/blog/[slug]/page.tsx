"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, Calendar, User } from "lucide-react";
import { useParams } from "next/navigation";

// Mock data for blog details
const blogData: Record<string, any> = {
  "the-future-of-sustainable-design": {
    title: "The Future of Sustainable Interior Design",
    date: "March 20, 2026",
    author: "Amani",
    category: "Sustainability",
    image: "/images/hero.png",
    content: [
      { type: "p", text: "As we step into a more environmentally conscious era, the field of interior design is undergoing a profound transformation. Sustainability is no longer a niche choice; it is now the foundation of modern luxury." },
      { type: "h2", text: "Material Innovation" },
      { type: "p", text: "From mycelium-grown lampshades to recycled ocean plastic furniture, the materials we bring into our homes are becoming cleaner and more revolutionary. The aesthetic focus has shifted from high-gloss synthetics to raw, organic textures that age beautifully over time." },
      { type: "image", src: "/images/project1.png" },
      { type: "p", text: "Biophilic design specifically has gained immense traction—integrating living greenery, natural light, and organic forms to create spaces that heal as much as they house. The goal is to create a seamless connection between the indoors and the natural world outside." }
    ]
  },
  "minimalism-vs-maximalism-in-2026": {
    title: "Minimalism vs. Maximalism in 2026",
    date: "March 15, 2026",
    author: "Elena",
    category: "Trends",
    image: "/images/project1.png",
    content: [
      { type: "p", text: "The perennial debate between the 'less is more' and 'more is more' philosophies continues to evolve. In 2026, we see a middle ground emerging—one that values intentionality over volume." },
      { type: "h2", text: "Curated Intentionality" },
      { type: "p", text: "Modern minimalism isn't just about empty rooms; it's about only keeping what serves a purpose or brings joy. Conversely, 2026 maximalism is about rich storytelling through curated collections, not clutter." }
    ]
  }
};

export default function BlogDetail() {
  const params = useParams();
  const slug = params?.slug as string;
  const blog = blogData[slug] || blogData["the-future-of-sustainable-design"];

  return (
    <div style={{ fontFamily: "'Satoshi', sans-serif", background: "#f0f0f0", minHeight: "100vh" }}>
      {/* ── HEADER ── */}
      <section style={{ padding: "120px 0 60px" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 48px" }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Link href="/blog" style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 700, fontSize: "14px", color: "#666", marginBottom: "32px", textDecoration: "none" }}>
              <ArrowLeft size={16} /> Back to Blog
            </Link>
            
            <div style={{ display: "flex", gap: "16px", alignItems: "center", marginBottom: "16px" }}>
              <span style={{ color: "#888", fontSize: "11px", display: "flex", alignItems: "center", gap: "4px", fontWeight: 600 }}>
                <Calendar size={11} /> {blog.date}
              </span>
              <span style={{ color: "#888", fontSize: "11px", display: "flex", alignItems: "center", gap: "4px", fontWeight: 600 }}>
                <User size={11} /> {blog.author}
              </span>
              <span style={{ 
                background: "#ddd", padding: "3px 10px", borderRadius: "999px", 
                fontSize: "10px", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase" 
              }}>
                {blog.category}
              </span>
            </div>

            <h1 style={{ 
              fontWeight: 800, fontSize: "clamp(2rem, 5vw, 3.5rem)", 
              letterSpacing: "-0.04em", lineHeight: 1.1, color: "#111", margin: 0 
            }}>
              {blog.title}
            </h1>
          </motion.div>
        </div>
      </section>

      {/* ── HERO IMAGE ── */}
      <section>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 48px" }}>
          <div style={{ position: "relative", borderRadius: "24px", overflow: "hidden", aspectRatio: "21/9" }}>
            <Image src={blog.image} alt={blog.title} fill sizes="100vw" style={{ objectFit: "cover" }} />
          </div>
        </div>
      </section>

      {/* ── CONTENT ── */}
      <section style={{ padding: "64px 0 100px" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 48px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            {blog.content?.map((item: any, i: number) => {
              if (item.type === "h2") return <h2 key={i} style={{ fontWeight: 800, fontSize: "2rem", letterSpacing: "-0.03em", margin: "20px 0 0" }}>{item.text}</h2>;
              if (item.type === "p") return <p key={i} style={{ color: "#444", fontSize: "16px", lineHeight: 1.8, margin: 0 }}>{item.text}</p>;
              if (item.type === "image") return (
                <div key={i} style={{ position: "relative", borderRadius: "16px", overflow: "hidden", aspectRatio: "16/10", margin: "20px 0" }}>
                  <Image src={item.src} alt="Article Detail" fill sizes="40vw" style={{ objectFit: "cover" }} />
                </div>
              );
              return null;
            })}
          </div>

          {/* Social Share / Footer */}
          <div style={{ marginTop: "64px", borderTop: "1px solid #e0e0e0", paddingTop: "40px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ fontWeight: 700, fontSize: "14px", margin: 0 }}>Share this article</p>
            <div style={{ display: "flex", gap: "10px" }}>
              {["FB", "X", "LI"].map(s => (
                <div key={s} style={{ height: "36px", width: "36px", borderRadius: "50%", border: "1px solid #ccc", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700 }}>{s}</div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
