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
  transition: { duration: 0.45, ease: "easeOut", delay },
});

function SectionHeader({ label, heading, right }: { label: string; heading: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[180px_1fr_1fr] gap-6 lg:gap-8 py-10 lg:py-14 border-b border-[#e0e0e0]">
      <div className="flex items-start gap-2 pt-1">
        <span className="w-2 h-2 rounded-full bg-[#111] shrink-0 mt-1.5 block" />
        <span className="font-medium text-[13px] text-[#111]">{label}</span>
      </div>
      <h2 className="font-bold text-[1.6rem] md:text-[2.2rem] lg:text-[2.5rem] leading-[1.1] tracking-[-0.03em] text-[#111] m-0">{heading}</h2>
      <div className="flex flex-col justify-start">{right}</div>
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
    <div className="bg-[#f0f0f0] min-h-screen">

      {/* ── HERO ── */}
      <section className="relative h-[52vh] min-h-[350px] overflow-hidden">
        <Image src="/images/project1.png" alt="Projects" fill sizes="100vw" priority className="object-cover" />
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-x-0 bottom-0 px-6 md:px-12 lg:px-16 pb-12 lg:pb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-10">
          <h1 className="font-extrabold text-[2.8rem] md:text-[4.5rem] lg:text-[6rem] leading-[0.95] tracking-[-0.04em] text-white m-0">
            Projects
          </h1>
          <p className="text-white/70 text-sm md:text-base leading-relaxed max-w-sm m-0">
            From a small beginning to a bold vision, we design spaces that shape lives.
          </p>
        </div>
      </section>

      {/* ── EXCLUSIVE PROJECTS ── */}
      <section className="px-6 md:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[180px_1fr_1fr] gap-6 lg:gap-8 py-10 lg:py-14 border-b border-[#e0e0e0]">
            <div className="flex items-start gap-2 pt-1">
              <span className="w-2 h-2 rounded-full bg-[#111] shrink-0 mt-1.5 block" />
              <span className="font-medium text-[13px] text-[#111]">Exclusive Projects</span>
            </div>
            <h2 className="font-bold text-[1.6rem] md:text-[2.2rem] lg:text-[2.5rem] leading-[1.1] tracking-[-0.03em] m-0">
              Boldly Rooted in Vision.<br />Exclusive In Execution.
            </h2>
            <div className="flex flex-col justify-between gap-6">
              <p className="text-sm text-[#666] leading-relaxed m-0">
                A visual library of interiors brought to life from blueprint to beauty.
              </p>
              <div className="flex gap-2.5 justify-start lg:justify-end">
                <button onClick={prev} className="h-10 w-10 rounded-full bg-[#111] text-white flex items-center justify-center active:bg-[#333] transition-colors">
                  <ChevronLeft size={18} />
                </button>
                <button onClick={next} className="h-10 w-10 rounded-full bg-[#111] text-white flex items-center justify-center active:bg-[#333] transition-colors">
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Carousel */}
          <div className="py-8 lg:py-16">
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="relative rounded-3xl overflow-hidden aspect-[16/9] lg:aspect-[21/9]"
            >
              <Image src={slide.image} alt={slide.title} fill sizes="100vw" className="object-cover" />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10">
                <p className="font-bold text-lg md:text-2xl text-white m-0 tracking-tight">{slide.title}</p>
                <p className="text-white/60 text-xs md:text-sm mt-2 font-medium uppercase tracking-widest">{slide.category} · {slide.year}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FEATURED PROJECTS ── */}
      <section className="px-6 md:px-12 lg:px-16 pb-16 lg:pb-24">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            label="Featured Projects"
            heading={<>Spaces That Inspire.<br />Projects That Last.</>}
            right={<p className="text-sm text-[#666] leading-relaxed max-w-sm m-0">Discover our range of interior designs that turn ideas into stunning spaces!</p>}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 lg:gap-10 pt-10 lg:pt-16">
            {featuredProjects.map((p, i) => (
              <motion.div key={i} {...fade(i * 0.07)} className="flex flex-col gap-4 group">
                <Link href={`/projects/${p.title.toLowerCase().replace(/ /g, "-")}`} className="relative rounded-2xl md:rounded-3xl overflow-hidden aspect-square block">
                  <Image src={p.image} alt={p.title} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                </Link>
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <Link href={`/projects/${p.title.toLowerCase().replace(/ /g, "-")}`} className="no-underline">
                      <p className="font-bold text-[16px] lg:text-[18px] text-[#111] mb-2 leading-tight tracking-tight hover:underline underline-offset-4">{p.title}</p>
                    </Link>
                    <div className="flex gap-2 flex-wrap">
                      {p.tags.map((t) => (
                        <span key={t} className="text-[10px] md:text-[11px] font-semibold text-[#555] border border-[#c8c8c8] rounded-full px-2.5 py-1">{t}</span>
                      ))}
                    </div>
                  </div>
                  <Link href={`/projects/${p.title.toLowerCase().replace(/ /g, "-")}`} className="h-9 w-9 rounded-full border border-[#c8c8c8] flex items-center justify-center shrink-0 transition-colors group-hover:bg-[#111] group-hover:border-[#111] group-hover:text-white">
                    <ArrowUpRight size={14} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-6 md:px-12 lg:px-16 mb-20 lg:mb-32">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            label="Contact"
            heading={<>Together, We Shape<br />the Extraordinary</>}
            right={<p className="text-sm text-[#666] leading-relaxed max-w-sm m-0">Interested in working with us? Let&apos;s bring your space to life.</p>}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 py-10 lg:py-14">
            <div className="relative rounded-3xl overflow-hidden aspect-[16/9] md:aspect-auto group cursor-pointer">
              <Image src="/images/hero.png" alt="CTA" fill sizes="50vw" className="object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/35" />
              <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 text-white font-bold text-lg md:text-xl tracking-tight">Step Into Your Dream Space</div>
            </div>
            <div className="bg-white rounded-3xl p-10 lg:p-16 flex flex-col gap-6 justify-center shadow-xs">
              <p className="text-[11px] font-bold tracking-[0.16em] text-[#888] uppercase m-0">Begin your design journey</p>
              <p className="text-[#555] text-base lg:text-lg leading-relaxed m-0 text-balance">
                Let&apos;s create something truly incredible together. Your ideal space begins right here with us.
              </p>
              <Link href="/contact" className="inline-flex items-center gap-1.5 font-bold text-sm md:text-base text-[#111] hover:underline underline-offset-8 decoration-2 mt-4 transition-all">
                Contact Us <ArrowUpRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
