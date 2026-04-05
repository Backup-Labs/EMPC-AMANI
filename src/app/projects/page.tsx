"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 15 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as any, delay },
});

// Shared section-label row (Responsive)
function SectionHeader({ label, heading, desc, rightEl }: { label: string; heading: React.ReactNode; desc?: string; rightEl?: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr_1fr] gap-10 lg:gap-16 py-20 lg:py-32 border-b border-black/5">
      {/* Label */}
      <div className="flex items-start gap-4 pt-2">
        <span className="w-2.5 h-2.5 rounded-full bg-black shrink-0 mt-2 block" />
        <span className="font-black text-[14px] uppercase tracking-widest text-[#111]">{label}</span>
      </div>
      {/* Heading */}
      <div>
        <h2 className="font-black text-[2.5rem] md:text-[3.2rem] lg:text-[3.8rem] leading-[0.9] tracking-[-0.05em] text-[#111] m-0">
          {heading}
        </h2>
      </div>
      {/* Description / CTA */}
      <div className="flex flex-col justify-between gap-6">
        {desc && <p className="text-lg text-[#555] leading-relaxed m-0 max-w-sm">{desc}</p>}
        {rightEl}
      </div>
    </div>
  );
}

const exclusiveProjects = [
  { title: "Coastal Serenity", category: "Residential", year: "2024", image: "/images/hero.png" },
  { title: "Azure Hallway", category: "Commercial", year: "2025", image: "/images/project1.png" },
  { title: "Urban Tranquility", category: "Hospitality", year: "2024", image: "/images/project2.png" },
];

const featuredProjects = [
  { title: "Nordic Light Loft", tags: ["Scandinavian", "Functional"], image: "/images/hero.png" },
  { title: "Redwood Horizon", tags: ["Timber", "Nature"], image: "/images/project1.png" },
  { title: "Atelier Noir", tags: ["Monochrome", "Industrial"], image: "/images/project2.png" },
  { title: "Noir Culture Studio", tags: ["Studio", "New Transition"], image: "/images/hero.png" },
  { title: "Maison Éclat Studio", tags: ["Apartment", "Interior Design"], image: "/images/project1.png" },
];

export default function Projects() {
  const [idx, setIdx] = useState(0);
  const prev = () => setIdx((i) => (i - 1 + exclusiveProjects.length) % exclusiveProjects.length);
  const next = () => setIdx((i) => (i + 1) % exclusiveProjects.length);
  const slide = exclusiveProjects[idx];

  return (
    <div className="bg-white min-h-screen overflow-x-hidden relative">

      {/* ── HERO ── */}
      <section className="relative h-[65vh] min-h-[500px] overflow-hidden">
        <Image src="/images/project1.png" alt="Projects" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-linear-to-b from-black/60 via-transparent to-black/40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,0,0,0.05)_0%,transparent_60%)]" />
        
        {/* Hero Content */}
        <div className="absolute inset-x-0 bottom-0 pb-16 lg:pb-24 px-6 md:px-12 lg:px-16 container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" as any }}
              className="font-black text-[3rem] md:text-[4.5rem] lg:text-[6.5rem] leading-[0.85] tracking-[-0.05em] text-white m-0"
            >
              Projects.
            </motion.h1>
            <p className="text-white/80 text-lg md:text-xl leading-relaxed max-w-sm m-0">
              A comprehensive library of crafted interiors and architectural interventions.
            </p>
          </div>
        </div>
      </section>

      {/* ── EXCLUSIVE PROJECTS ── */}
      <section className="px-6 md:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            label="Exclusive"
            heading={<>Boldly Rooted.<br />Flawlessly Executed.</>}
            desc="A visual narrative of interiors brought to life from blueprint to beauty."
            rightEl={
              <div className="flex gap-4">
                <button onClick={prev} className="h-14 w-14 rounded-full glass flex items-center justify-center hover:bg-black hover:text-white transition-all active:scale-95 shadow-sm">
                  <ChevronLeft size={24} />
                </button>
                <button onClick={next} className="h-14 w-14 rounded-full glass flex items-center justify-center hover:bg-black hover:text-white transition-all active:scale-95 shadow-sm">
                  <ChevronRight size={24} />
                </button>
              </div>
            }
          />

          <div className="py-20">
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as any }}
              className="relative rounded-[48px] overflow-hidden aspect-[16/9] lg:aspect-[21/9] shadow-3xl"
            >
              <Image src={slide.image} alt={slide.title} fill sizes="100vw" className="object-cover" />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-12 left-12">
                <p className="font-black text-[2.5rem] md:text-[4rem] text-white m-0 tracking-[-0.05em]">{slide.title}</p>
                <div className="mt-6 flex gap-4">
                  <span className="glass px-6 py-2 rounded-full text-xs font-black text-white uppercase tracking-widest">{slide.category}</span>
                  <span className="glass px-6 py-2 rounded-full text-xs font-black text-white uppercase tracking-widest">{slide.year}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FEATURED PORTFOLIO ── */}
      <section className="px-6 md:px-12 lg:px-16 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            label="Portfolio"
            heading={<>Spaces That Last.<br />Inspiring Living.</>}
            desc="Our diverse body of work explores the intersection of luxury and utility."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 pt-20">
            {featuredProjects.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] as any }}
                className="flex flex-col gap-6 group"
              >
                <div className="relative rounded-[32px] overflow-hidden aspect-square shadow-lg">
                  <Image src={p.image} alt={p.title} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-out" />
                  <div className="absolute top-6 left-6 flex gap-2">
                    {p.tags.map(t => (
                      <span key={t} className="glass text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full text-[#111]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between items-center pr-4">
                  <p className="font-black text-2xl text-[#111] leading-tight tracking-tighter hover:text-primary transition-colors cursor-pointer">{p.title}</p>
                  <div className="h-12 w-12 rounded-full border border-black/10 flex items-center justify-center transition-all group-hover:bg-primary group-hover:border-primary group-hover:text-white">
                    <ArrowUpRight size={20} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-6 md:px-12 lg:px-16 mb-48">
        <div className="max-w-7xl mx-auto">
          <div className="glass rounded-[64px] p-12 lg:p-24 overflow-hidden relative shadow-3xl text-center">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_100%,rgba(0,0,0,0.02)_0%,transparent_70%)]" />
            <div className="relative z-10 max-w-2xl mx-auto">
              <span className="font-black text-black uppercase tracking-[0.3em] text-[11px] mb-8 block">Next Step</span>
              <h2 className="font-black text-[2.8rem] md:text-[3.5rem] leading-[0.85] tracking-[-0.05em] text-[#111] m-0 mb-10">
                Ready to transform your space?
              </h2>
              <Link href="/contact" className="inline-flex h-16 items-center px-12 rounded-full bg-[#111] text-white font-black hover:bg-black transition-all shadow-xl group">
                Contact Studio <ArrowUpRight size={20} className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
