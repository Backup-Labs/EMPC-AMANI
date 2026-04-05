"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";

// ─── DATA ────────────────────────────────────────────────────────────────────

const exclusiveProjects = [
  { title: "Coastal Serenity", category: "Residential", year: "2024", image: "/images/hero.png" },
  { title: "Azure Hallway", category: "Commercial", year: "2025", image: "/images/project1.png" },
  { title: "Urban Tranquility", category: "Hospitality", year: "2024", image: "/images/project2.png" },
];

const featuredProjects = [
  { title: "Nordic Light Loft", tags: ["Scandinavian", "Functional"], image: "/images/hero.png" },
  { title: "Redwood Horizon", tags: ["Timber", "Nature"], image: "/images/project1.png" },
  { title: "Atelier Noir", tags: ["Monochrome", "Industrial"], image: "/images/project2.png" },
];

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
      <div className="flex items-start gap-3 pt-2">
        <span className="w-2.5 h-2.5 rounded-full bg-primary shrink-0 mt-2 block" />
        <span className="font-bold text-[14px] uppercase tracking-widest text-[#111]">{label}</span>
      </div>
      {/* Heading */}
      <div>
        <h2 className="font-black text-[2.5rem] md:text-[3.2rem] lg:text-[3.8rem] leading-[0.9] tracking-[-0.05em] text-[#111] m-0">
          {heading}
        </h2>
      </div>
      {/* Description / CTA */}
      <div className="flex flex-col justify-between gap-6">
        {desc && <p className="text-lg text-[#555] leading-relaxed m-0 max-w-md">{desc}</p>}
        {rightEl}
      </div>
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
    <div className="bg-white min-h-screen overflow-x-hidden relative">

      {/* ── HERO ── */}
      <section className="relative h-screen min-h-[800px] overflow-hidden">
        <Image src="/images/hero.png" alt="EMPC-AMANI Interior" fill priority sizes="100vw" className="object-cover" />
        {/* Monochromatic ambient glow */}
        <div className="absolute inset-0 bg-linear-to-b from-black/60 via-transparent to-black/40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,0,0,0.05)_0%,transparent_60%)]" />

        {/* Hero Content */}
        <div className="absolute inset-x-0 bottom-0 pb-16 lg:pb-24 px-6 md:px-12 lg:px-16 container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
            <div className="max-w-[850px]">
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as any }}
                className="font-black text-[3rem] md:text-[4.5rem] lg:text-[6.5rem] leading-[0.85] tracking-[-0.05em] text-white m-0"
              >
                Visionary<br />Spaces.
              </motion.h1>
              <p className="text-white/80 text-lg md:text-xl leading-relaxed mt-8 max-w-lg">
                We blend timeless elegance with modern functionality, crafting
                interiors that are as purposeful as they are beautiful.
              </p>
            </div>

            {/* Floating Glass Project card */}
            <Link href="/projects" className="shrink-0 transition-all hover:scale-105 active:scale-95 group relative z-10">
              <div className="glass rounded-[32px] overflow-hidden w-56 md:w-64 p-3 shadow-2xl">
                <div className="relative h-40 rounded-[22px] overflow-hidden">
                  <Image src="/images/project1.png" alt="Azure Hallway" fill sizes="256px" className="object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
                <div className="pt-4 px-2 pb-2 flex justify-between items-center">
                  <span className="font-bold text-[14px] text-[#111]">Exclusive Work</span>
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white">
                    <ArrowUpRight size={16} />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ── STUDIO SECTION ── */}
      <section className="px-6 md:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            label="Studio"
            heading={<>Clear Vision.<br />Masterful Detail.</>}
            desc="Our philosophy blends contemporary aesthetics with deep functional purpose in every environment we touch."
            rightEl={
              <Link href="/about" className="inline-flex items-center gap-2 group font-bold text-base text-primary">
                Learn our story <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Link>
            }
          />
        </div>
      </section>

      {/* ── FULL-WIDTH IMAGE + STATS ── */}
      <section className="px-6 md:px-12 lg:px-16 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto">
          {/* Large radius image */}
          <div className="relative rounded-[48px] overflow-hidden aspect-[21/9] mb-16 lg:mb-24 shadow-2xl">
            <Image src="/images/project2.png" alt="Studio" fill sizes="100vw" className="object-cover" />
          </div>

          {/* New Stats design */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 lg:gap-24">
            {[
              { val: "150+", label: "Transformative Designs", desc: "Crafting narratives through physical space since 2012." },
              { val: "45", label: "Design Awards", desc: "Recognized internationally for innovation and craft." },
              { val: "12ct", label: "Global Reach", desc: "Delivering world-class interiors across 12 countries." },
            ].map((s, i) => (
              <div key={i} className="flex flex-col border-l-2 border-black/5 pl-8">
                <p className="font-black text-[3.5rem] lg:text-[4rem] tracking-[-0.05em] text-[#111] m-0 leading-none">{s.val}</p>
                <p className="font-black text-lg text-[#111] mt-4 mb-4 uppercase tracking-tighter">{s.label}</p>
                <p className="text-base text-[#666] leading-relaxed m-0">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EXCLUSIVE PROJECTS (carousel) ── */}
      <section className="px-6 md:px-12 lg:px-16 bg-muted relative">
        {/* Subtle glow layer */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(0,0,0,0.02)_0%,transparent_50%)]" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <SectionHeader
            label="Exclusive"
            heading={<>Boldly Rooted.<br />Flawlessly Executed.</>}
            desc="A curated selection of our most ambitious architectural interventions and luxury residential projects."
          />
          
          <div className="py-20">
            <div className="flex gap-4 justify-end mb-8">
              <button onClick={prevSlide} className="h-14 w-14 rounded-full glass flex items-center justify-center hover:bg-black hover:text-white transition-all active:scale-95">
                <ChevronLeft size={24} />
              </button>
              <button onClick={nextSlide} className="h-14 w-14 rounded-full glass flex items-center justify-center hover:bg-black hover:text-white transition-all active:scale-95">
                <ChevronRight size={24} />
              </button>
            </div>

            <motion.div
              key={carouselIdx}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as any }}
              className="relative rounded-[48px] overflow-hidden aspect-[21/9] shadow-3xl"
            >
              <Image src={slide.image} alt={slide.title} fill sizes="100vw" className="object-cover" />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-transparent" />
              <div className="absolute bottom-12 left-12">
                <p className="font-black text-[2rem] md:text-[3rem] text-white m-0 tracking-[-0.05em]">{slide.title}</p>
                <Link href={`/projects/${slide.title.toLowerCase().replace(/ /g, "-")}`} className="mt-6 inline-flex h-12 items-center px-8 rounded-full glass text-sm font-bold text-white hover:bg-white hover:text-black transition-all">
                  Exploration <ArrowUpRight size={16} className="ml-2" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FEATURED PROJECTS ── */}
      <section className="px-6 md:px-12 lg:px-16 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            label="Portfolio"
            heading={<>Inspiring Spaces.<br />Resonant Experience.</>}
            desc="Our diverse range of work spans from boutique retail to high-end hospitality."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 pt-20">
            {featuredProjects.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
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
                  <p className="font-black text-2xl text-[#111] leading-tight tracking-tighter">{p.title}</p>
                  <div className="h-12 w-12 rounded-full border border-black/10 flex items-center justify-center transition-all group-hover:bg-primary group-hover:border-primary group-hover:text-white">
                    <ArrowUpRight size={20} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BLOG STRIP ── */}
      <section className="px-6 md:px-12 lg:px-16 py-20 lg:py-40 bg-muted overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-linear-to-r from-transparent via-black/10 to-transparent" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex justify-between items-end pb-12 border-b border-black/5">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-2.5 h-2.5 rounded-full bg-primary block" />
                <span className="font-bold text-[14px] uppercase tracking-widest text-[#555]">Journal</span>
              </div>
               <h2 className="font-black text-[2.5rem] md:text-[3.5rem] text-[#111] leading-[0.9] tracking-[-0.05em] m-0">Latest Stories.</h2>
            </div>
            <Link href="/blog" className="h-14 w-14 rounded-full glass flex items-center justify-center hover:bg-primary hover:text-white transition-all text-primary">
              <ArrowUpRight size={24} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-20">
            {[
              { title: "Future of Sustainable Design", date: "20.03.26", image: "/images/hero.png" },
              { title: "Minimalism vs. Maximalism", date: "15.03.26", image: "/images/project1.png" },
              { title: "Psychology in Workspace", date: "10.03.26", image: "/images/project2.png" },
            ].map((b, i) => (
              <motion.div key={i} {...fade(i * 0.1)}>
                <Link href={`/blog/${b.title.toLowerCase().replace(/ /g, "-")}`} className="group block">
                  <div className="relative rounded-[32px] overflow-hidden aspect-[16/10] mb-8 shadow-md">
                    <Image src={b.image} alt={b.title} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover grow group-hover:scale-110 transition-transform duration-1000" />
                  </div>
                  <p className="text-[11px] font-black text-primary mb-3 flex items-center gap-2 uppercase tracking-widest">{b.date}</p>
                  <p className="font-black text-2xl text-[#111] leading-tight tracking-tight m-0 hover:text-primary transition-colors">{b.title}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
