"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { useParams } from "next/navigation";

// Mock data for project details
const projectData: Record<string, any> = {
  "coastal-serenity": {
    title: "Coastal Serenity",
    category: "Vacation / Coastal",
    image: "/images/hero.png",
    client: "The Shoreline Group",
    location: "Malibu, California",
    year: "2024",
    concept: "Oceanic Bliss",
    style: "Modern Minimalist",
    description: "A sanctuary designed to blur the lines between indoor luxury and the vast horizon of the Pacific Ocean. Using natural stone, light timbers, and a palette inspired by seafoam and sand, we created a space that breathes with the tides.",
    gallery: ["/images/project1.png", "/images/project2.png", "/images/hero.png"]
  },
  "azure-hallway": {
    title: "Azure Hallway",
    category: "Commercial / Office",
    image: "/images/project1.png",
    client: "Azure Tech Corp",
    location: "Seattle, WA",
    year: "2025",
    concept: "Flowing Connectivity",
    style: "Industrial Chic",
    description: "An office space that prioritizes movement and collaborative energy. The Azure Hallway uses bold architectural lines and deep blue accents to guide employees through a series of dynamic zones.",
    gallery: ["/images/project2.png", "/images/hero.png", "/images/project1.png"]
  }
};

export default function ProjectDetail() {
  const params = useParams();
  const slug = params?.slug as string;
  const project = projectData[slug] || projectData["coastal-serenity"]; // Default fallback

  return (
    <div style={{ fontFamily: "'Satoshi', sans-serif", background: "#f0f0f0", minHeight: "100vh" }}>
      {/* ── HERO ── */}
      <section style={{ position: "relative", height: "80vh", minHeight: "500px", overflow: "hidden" }}>
        <Image src={project.image} alt={project.title} fill sizes="100vw" priority style={{ objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)" }} />
        
        <div style={{ position: "absolute", bottom: "60px", left: "48px", right: "48px" }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span style={{ 
              display: "inline-block", padding: "6px 14px", borderRadius: "999px", 
              border: "1px solid rgba(255,255,255,0.4)", color: "#fff", 
              fontSize: "12px", fontWeight: 600, marginBottom: "16px",
              backdropFilter: "blur(4px)"
            }}>
              {project.category}
            </span>
            <h1 style={{ 
              fontWeight: 800, fontSize: "clamp(3rem, 8vw, 6rem)", 
              letterSpacing: "-0.04em", lineHeight: 1, color: "#fff", margin: 0 
            }}>
              {project.title}
            </h1>
          </motion.div>
        </div>
      </section>

      {/* ── INFO BAR ── */}
      <section style={{ background: "white", borderBottom: "1px solid #e0e0e0" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "40px 48px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "24px" }}>
            {[
              { label: "Client", value: project.client },
              { label: "Location", value: project.location },
              { label: "Year", value: project.year },
              { label: "Concept", value: project.concept },
              { label: "Inspiration style", value: project.style },
            ].map((item, i) => (
              <div key={i}>
                <p style={{ color: "#888", fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 8px" }}>{item.label}</p>
                <p style={{ color: "#111", fontSize: "14px", fontWeight: 600, margin: 0 }}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTENT ── */}
      <section style={{ padding: "80px 0" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 48px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "64px" }}>
            <div>
              <h2 style={{ fontWeight: 700, fontSize: "2rem", letterSpacing: "-0.025em", margin: "0 0 24px" }}>Concept &amp; Objective</h2>
              <p style={{ color: "#555", fontSize: "15px", lineHeight: 1.8, margin: 0 }}>
                {project.description}
              </p>
            </div>
            <div style={{ position: "relative", borderRadius: "20px", overflow: "hidden", aspectRatio: "4/3" }}>
              <Image src={project.gallery[0]} alt="Process" fill sizes="40vw" style={{ objectFit: "cover" }} />
            </div>
          </div>

          {/* Large image grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginTop: "64px" }}>
            <div style={{ position: "relative", borderRadius: "20px", overflow: "hidden", aspectRatio: "16/10", gridColumn: "span 2" }}>
              <Image src={project.gallery[1]} alt="Interior 1" fill sizes="90vw" style={{ objectFit: "cover" }} />
            </div>
            <div style={{ position: "relative", borderRadius: "20px", overflow: "hidden", aspectRatio: "4/5" }}>
              <Image src={project.gallery[2]} alt="Interior 2" fill sizes="45vw" style={{ objectFit: "cover" }} />
            </div>
            <div style={{ position: "relative", borderRadius: "20px", overflow: "hidden", aspectRatio: "4/5" }}>
              <Image src={project.image} alt="Interior 3" fill sizes="45vw" style={{ objectFit: "cover" }} />
            </div>
          </div>
        </div>
      </section>

      {/* ── NAVIGATION ── */}
      <section style={{ paddingBottom: "100px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 48px" }}>
          <div style={{ borderTop: "1px solid #e0e0e0", paddingTop: "48px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Link href="/projects" style={{ display: "flex", alignItems: "center", gap: "8px", color: "#111", fontWeight: 700, fontSize: "14px", textDecoration: "none" }}>
              <ArrowLeft size={16} /> Back to Projects
            </Link>
            <Link href="/contact" style={{ display: "flex", alignItems: "center", gap: "8px", color: "#111", fontWeight: 700, fontSize: "14px", textDecoration: "none" }}>
              Start a Project <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
