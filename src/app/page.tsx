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
  { title: "Nordic Light Loft", tags: ["Scandinavian", "Functional Elegance"], image: "/images/hero.png" },
  { title: "Redwood Horizon", tags: ["Timber Architecture", "Nature Immersion"], image: "/images/project1.png" },
  { title: "Atelier Noir", tags: ["Monochrome", "Industrial Chic"], image: "/images/project2.png" },
];

// Shared section-label row (Responsive 3 columns)
function SectionHeader({ label, heading, desc, rightEl }: { label: string; heading: React.ReactNode; desc?: string; rightEl?: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[180px_1fr_1fr] gap-6 lg:gap-8 py-10 lg:py-14 border-b border-[#e0e0e0]">
      {/* Label */}
      <div className="flex items-start gap-2 pt-1">
        <span className="w-2 h-2 rounded-full bg-[#111] shrink-0 mt-1.5 block" />
        <span className="font-medium text-[13px] text-[#111]">{label}</span>
      </div>
      {/* Heading */}
      <div>
        <h2 className="font-bold text-[1.6rem] md:text-[2.2rem] lg:text-[2.5rem] leading-[1.1] tracking-[-0.03em] text-[#111] m-0">
          {heading}
        </h2>
      </div>
      {/* Description / CTA */}
      <div className="flex flex-col justify-between gap-4">
        {desc && <p className="text-sm text-[#666] leading-relaxed m-0 max-w-md lg:max-w-none">{desc}</p>}
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
    <div className="bg-white min-h-screen overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="relative h-screen min-h-[600px] overflow-hidden">
        <Image src="/images/hero.png" alt="EMPC-AMANI Interior" fill priority sizes="100vw" className="object-cover" />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-br from-black/50 via-black/20 to-black/35" />

        {/* Hero Content */}
        <div className="absolute inset-x-0 bottom-0 px-6 md:px-12 lg:px-16 pb-12 lg:pb-20 flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
          <div className="max-w-[700px]">
            <h1 className="font-extrabold text-[2.8rem] md:text-[4.5rem] lg:text-[6rem] leading-[0.95] tracking-[-0.04em] text-white m-0">
              Where Aesthetics Meet<br />Purposeful Living
            </h1>
            <p className="text-white/70 text-sm md:text-base leading-relaxed mt-6 max-w-md">
              We create interiors that blend timeless elegance with modern functionality,
              reflecting your story and lifestyle. Let's build something beautiful together.
            </p>
          </div>

          {/* Floating project card - hidden on small mobile if needed, but here kept small */}
          <Link href="/projects" className="shrink-0 transition-transform active:scale-95 group">
            <div className="bg-white/15 backdrop-blur-xl border border-white/25 rounded-2xl overflow-hidden w-48 md:w-56">
              <div className="relative h-32">
                <Image src="/images/project1.png" alt="Azure Hallway" fill sizes="224px" className="object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-3.5 flex justify-between items-center bg-white/5">
                <span className="font-bold text-[12px] md:text-[13px] text-white">Azure Hallway</span>
                <ArrowUpRight size={16} className="text-white" />
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* ── STUDIO SECTION ── */}
      <section className="bg-[#f0f0f0] px-6 md:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            label="Studio"
            heading={<>Rooted in Clear Vision.<br />Driven by Detail.</>}
            desc="Our design philosophy blends story, structure, and soul to craft environments."
            rightEl={
              <Link href="/about" className="inline-flex items-center gap-1.5 font-bold text-sm text-[#111] hover:underline underline-offset-4 decoration-2">
                About Us <ArrowUpRight size={14} />
              </Link>
            }
          />
        </div>
      </section>

      {/* ── FULL-WIDTH IMAGE + STATS ── */}
      <section className="bg-[#f0f0f0] px-6 md:px-12 lg:px-16 pb-16 lg:pb-24">
        <div className="max-w-7xl mx-auto">
          {/* Full-width rounded image */}
          <div className="relative rounded-3xl overflow-hidden aspect-[16/9] md:aspect-[21/9] mb-12 lg:mb-16">
            <Image src="/images/project2.png" alt="Studio" fill sizes="100vw" className="object-cover" />
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {[
              { val: "46+", label: "Homes transformed", desc: "From apartments to luxurious villas, each project is a unique story of style." },
              { val: "29+", label: "Commercial spaces", desc: "Innovative designs that enhance functionality while maintaining aesthetic." },
              { val: "756+", label: "Satisfied Clients", desc: "Whether a homeowner or investor, our clients celebrate every transformation." },
            ].map((s, i) => (
              <div key={i}>
                <p className="font-extrabold text-[2.8rem] lg:text-[3.5rem] tracking-[-0.04em] text-[#666] m-0 leading-none">{s.val}</p>
                <p className="font-bold text-sm lg:text-base text-[#111] mt-2 mb-3 lg:mb-4">{s.label}</p>
                <p className="text-[13px] lg:text-sm text-[#666] leading-relaxed m-0">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EXCLUSIVE PROJECTS (carousel) ── */}
      <section className="bg-[#f0f0f0] px-6 md:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[180px_1fr_1fr] gap-6 lg:gap-8 py-10 lg:py-14 border-b border-[#e0e0e0]">
            <div className="flex items-start gap-2 pt-1">
              <span className="w-2 h-2 rounded-full bg-[#111] shrink-0 mt-1.5 block" />
              <span className="font-medium text-[13px] text-[#111]">Exclusive Projects</span>
            </div>
            <div>
              <h2 className="font-bold text-[1.6rem] md:text-[2.2rem] lg:text-[2.5rem] leading-[1.1] tracking-[-0.03em] text-[#111] m-0">
                Boldly Rooted in Vision.<br />Exclusive In Execution.
              </h2>
            </div>
            <div className="flex flex-col justify-between gap-6 lg:gap-8">
              <p className="text-sm text-[#666] leading-relaxed m-0">A visual library of interiors brought to life from blueprint to beauty.</p>
              <div className="flex gap-2.5 justify-start lg:justify-end">
                <button onClick={prevSlide} className="h-10 w-10 rounded-full bg-[#111] text-white flex items-center justify-center transition-colors active:bg-[#333]">
                  <ChevronLeft size={18} />
                </button>
                <button onClick={nextSlide} className="h-10 w-10 rounded-full bg-[#111] text-white flex items-center justify-center transition-colors active:bg-[#333]">
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>

          <div className="py-8 lg:py-14">
            <motion.div
              key={carouselIdx}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="relative rounded-3xl overflow-hidden aspect-[16/9] md:aspect-[21/9]"
            >
              <Image src={slide.image} alt={slide.title} fill sizes="100vw" className="object-cover transition-transform duration-700" />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10">
                <p className="font-bold text-lg md:text-2xl text-white m-0 tracking-tight">{slide.title}</p>
                <Link href={`/projects/${slide.title.toLowerCase().replace(/ /g, "-")}`} className="mt-2.5 inline-flex items-center gap-1.5 text-xs md:text-sm text-white/70 hover:text-white transition-colors">
                  View Detail <ArrowUpRight size={14} />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FEATURED PROJECTS ── */}
      <section className="bg-[#f0f0f0] px-6 md:px-12 lg:px-16 pb-16 lg:pb-24">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            label="Featured Projects"
            heading={<>Spaces That Inspire.<br />Projects That Last.</>}
            desc="Discover our range of interior designs that turn ideas into stunning spaces!"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8 pt-10 lg:pt-14">
            {featuredProjects.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className="flex flex-col gap-4 group cursor-pointer"
              >
                <div className="relative rounded-2xl overflow-hidden aspect-square">
                  <Image src={p.image} alt={p.title} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                </div>
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <p className="font-bold text-[15px] lg:text-[17px] text-[#111] mb-2 leading-tight tracking-tight">{p.title}</p>
                    <div className="flex gap-2 flex-wrap">
                      {p.tags.map((tag) => (
                        <span key={tag} className="text-[10px] md:text-[11px] font-semibold text-[#555] border border-[#c0c0c0] rounded-full px-2.5 py-1">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="h-9 w-9 rounded-full border border-[#c0c0c0] flex items-center justify-center transition-colors group-hover:bg-[#111] group-hover:border-[#111] group-hover:text-white shrink-0">
                    <ArrowUpRight size={14} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BLOG STRIP ── */}
      <section className="bg-[#f0f0f0] px-6 md:px-12 lg:px-16 pb-20 lg:pb-32">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center pb-8 border-b border-[#e0e0e0]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#111] block" />
              <span className="font-medium text-[13px] text-[#111]">Latest Blogs</span>
            </div>
            <Link href="/blog" className="font-bold text-[13px] text-[#111] hover:underline underline-offset-4 decoration-2 flex items-center gap-1">
              View All <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 lg:gap-10 pt-10 lg:pt-14">
            {[
              { title: "The Future of Sustainable Design", date: "Mar 20, 2026", image: "/images/hero.png" },
              { title: "Minimalism vs. Maximalism in 2026", date: "Mar 15, 2026", image: "/images/project1.png" },
              { title: "Color Psychology in Workspaces", date: "Mar 10, 2026", image: "/images/project2.png" },
            ].map((b, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.07 }}>
                <Link href={`/blog/${b.title.toLowerCase().replace(/ /g, "-")}`} className="group block">
                  <div className="relative rounded-2xl overflow-hidden aspect-[16/10] mb-5">
                    <Image src={b.image} alt={b.title} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover grow group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <p className="text-[11px] font-bold text-[#888] mb-2.5 flex items-center gap-2">{b.date}</p>
                  <p className="font-bold text-base lg:text-lg text-[#111] leading-snug tracking-tight m-0 group-hover:underline decoration-1 underline-offset-4">{b.title}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
