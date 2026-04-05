"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, CheckCircle, ShieldCheck, Target } from "lucide-react";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 15 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as any, delay },
});

const values = [
  { title: "Craftsmanship", desc: "Every intersection of material and light is considered with extreme care.", icon: ShieldCheck },
  { title: "Innovation", desc: "We push the boundaries of what's possible in modern living environments.", icon: Target },
  { title: "Integrity", desc: "Our commitment to quality is unwavering from blueprint to final reveal.", icon: CheckCircle },
];

const milestones = [
  { year: "2012", title: "Studio Founded", desc: "EMPC-AMANI begins with a small team and a bold design vision.", images: ["/images/hero.png", "/images/project1.png"] },
  { year: "2016", title: "Creative Growth", desc: "Expanded into commercial and hospitality design projects worldwide.", images: ["/images/project2.png", "/images/hero.png"] },
  { year: "2021", title: "Global Reach", desc: "Started delivering projects across three continents seamlessly.", images: ["/images/project1.png", "/images/project2.png"] },
  { year: "2026", title: "New Chapter", desc: "Leading luxury design with an innovative, human-centred approach.", images: ["/images/hero.png", "/images/project1.png"] },
];

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

// ─── PAGE ────────────────────────────────────────────────────────────────────

export default function About() {
  return (
    <div className="bg-white min-h-screen overflow-x-hidden relative">

      {/* ── HERO ── */}
      <section className="relative h-[65vh] min-h-[500px] overflow-hidden">
        <Image src="/images/hero.png" alt="About Us" fill priority sizes="100vw" className="object-cover" />
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
              Our Story.
            </motion.h1>
            <p className="text-white/80 text-lg md:text-xl leading-relaxed max-w-sm m-0">
              Discover the narrative behind our studio where passion meets precision.
            </p>
          </div>
        </div>
      </section>

      {/* ── INTRO ── */}
      <section className="px-6 md:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="py-24 md:py-32 grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-32 items-start border-b border-black/5">
            <motion.div {...fade()} className="flex flex-col gap-10">
              <h2 className="font-black text-[2rem] md:text-[2.8rem] lg:text-[3.5rem] leading-[0.9] tracking-[-0.05em] m-0">
                Rooted in Vision. Driven by Detail.
              </h2>
              <p className="text-[#555] text-lg leading-relaxed m-0 lg:max-w-md">
                Since day one, we&#39;ve believed that spaces and people shape each other.
                What started as a small design studio in London has grown into a full-service international
                design firm. EMPC-AMANI crafts interiors that are deeply personal and flawlessly executed.
              </p>
              <div className="grid grid-cols-2 gap-12 pt-12 border-t border-black/5">
                <div>
                  <p className="font-black text-[2.5rem] lg:text-[3.5rem] tracking-[-0.05em] text-black m-0 leading-none">120+</p>
                  <p className="text-[11px] font-black text-[#aaa] tracking-[0.2em] uppercase mt-4">Residences</p>
                </div>
                <div>
                  <p className="font-black text-[2.5rem] lg:text-[3.5rem] tracking-[-0.05em] text-black m-0 leading-none">12y</p>
                  <p className="text-[11px] font-black text-[#aaa] tracking-[0.2em] uppercase mt-4">Experience</p>
                </div>
              </div>
            </motion.div>
            <motion.div {...fade(0.1)} className="grid grid-cols-2 gap-4 lg:gap-6">
              <div className="relative rounded-[40px] overflow-hidden aspect-[3/4] shadow-2xl">
                <Image src="/images/project1.png" alt="Detail" fill sizes="50vw" className="object-cover" />
              </div>
              <div className="relative rounded-[40px] overflow-hidden aspect-[3/4] mt-12 shadow-2xl">
                <Image src="/images/project2.png" alt="Space" fill sizes="50vw" className="object-cover" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="px-6 md:px-12 lg:px-16 bg-muted relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(0,0,0,0.02)_0%,transparent_50%)]" />
        <div className="max-w-7xl mx-auto relative z-10">
          <SectionHeader
            label="Values"
            heading={<>Driven by Purpose.</>}
            desc="Our core principles define every project we undertake, from initial sketch to final reveal."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-20">
            {values.map((v, i) => (
              <motion.div key={i} {...fade(i * 0.1)} className="glass rounded-[40px] p-12 flex flex-col gap-8 group hover:shadow-2xl transition-all duration-700">
                <div className="h-16 w-16 rounded-[20px] bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform text-primary">
                  <v.icon size={30} />
                </div>
                <div>
                  <p className="font-black text-2xl text-[#111] mb-3">{v.title}</p>
                  <p className="text-[#666] text-lg leading-relaxed m-0">{v.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section className="px-6 md:px-12 lg:px-16 pb-20 lg:pb-32">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            label="History"
            heading={<>Design Journey.</>}
            desc="From our founding in 2012 to today, each chapter has shaped our distinct design language."
          />
          <div className="py-12 flex flex-col">
            {milestones.map((m, i) => (
              <motion.div key={i} {...fade(i * 0.1)}
                className="grid grid-cols-1 lg:grid-cols-[150px_1fr_1fr] gap-12 items-center py-20 border-b border-black/5 group">
                <p className="font-black text-xl text-[#ccc] group-hover:text-black transition-colors m-0 uppercase tracking-widest">{m.year}</p>
                <div className="max-w-md">
                  <p className="font-black text-2xl md:text-3xl text-[#111] mb-4 tracking-tighter">{m.title}</p>
                  <p className="text-[#666] text-lg leading-relaxed m-0">{m.desc}</p>
                </div>
                <div className="grid grid-cols-2 gap-6 scale-95 group-hover:scale-100 transition-transform duration-700">
                  {m.images.map((img, j) => (
                    <div key={j} className="relative rounded-[24px] overflow-hidden aspect-[4/3] shadow-lg">
                      <Image src={img} alt={m.title} fill sizes="25vw" className="object-cover" />
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-6 md:px-12 lg:px-16 mb-32 lg:mb-48">
        <div className="max-w-7xl mx-auto">
          <div className="glass rounded-[64px] p-12 lg:p-24 overflow-hidden relative shadow-3xl">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(circle_at_100%_0%,rgba(0,0,0,0.03)_0%,transparent_70%)]" />
            <div className="relative z-10 max-w-2xl">
              <span className="font-black text-black uppercase tracking-[0.3em] text-[11px] mb-8 block">Project Inquiry</span>
              <h2 className="font-black text-[2.8rem] md:text-[3.5rem] leading-[0.85] tracking-[-0.05em] text-[#111] m-0 mb-10">
                Shape Your<br />Extraordinary.
              </h2>
              <p className="text-[#555] text-xl leading-relaxed mb-12">
                Let&#39;s collaborate on your next space. Your ideal environment begins right here.
              </p>
              <Link href="/contact" className="inline-flex h-16 items-center px-12 rounded-full bg-[#111] text-white font-black hover:bg-black transition-all shadow-xl group">
                Start a Project <ArrowUpRight size={20} className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
