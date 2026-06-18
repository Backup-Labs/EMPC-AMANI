"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, CheckCircle, ShieldCheck, Target } from "lucide-react";
import { Counter } from "@/components/AnimatedComponents";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 15 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as any, delay },
});

const milestones = [
  { year: "2012", title: "Workshop Founded", desc: "EMPC-AMANI begins with two benches and a passion for solid wood.", images: ["/images/hero.png", "/images/project1.png"] },
  { year: "2016", title: "Industrial Expansion", desc: "Scale production for boutique hotels and luxury offices began.", images: ["/images/project2.png", "/images/hero.png"] },
  { year: "2021", title: "Vocational Partnership", desc: "Launched our first student certification program with RTB.", images: ["/images/project1.png", "/images/project2.png"] },
  { year: "2026", title: "Mastery Hub", desc: "Expanding our campus to become the premier carpentry training hub.", images: ["/images/hero.png", "/images/project1.png"] },
];

// Shared section-label row (Responsive)
function SectionHeader({ label, heading, desc, rightEl }: { label: string; heading: React.ReactNode; desc?: string; rightEl?: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr_1fr] gap-10 lg:gap-16 py-12 lg:py-20 border-b border-border">
      {/* Label */}
      <div className="flex items-start gap-4 pt-2">
        <span className="w-2.5 h-2.5 rounded-full bg-primary shrink-0 mt-2 block" />
        <span className="font-black text-[14px] uppercase tracking-widest text-foreground">{label}</span>
      </div>
      {/* Heading */}
      <div>
        <h2 className="font-black text-[2.5rem] md:text-[3.2rem] lg:text-[3.8rem] leading-[0.9] tracking-[-0.05em] text-foreground m-0">
          {heading}
        </h2>
      </div>
      {/* Description / CTA */}
      <div className="flex flex-col justify-between gap-6">
        {desc && <p className="text-lg text-foreground/60 leading-relaxed m-0 max-w-sm">{desc}</p>}
        {rightEl}
      </div>
    </div>
  );
}

// ─── PAGE ────────────────────────────────────────────────────────────────────

export default function About() {
  const [activeMile, setActiveMile] = useState(0);

  return (
    <div className="bg-background min-h-screen overflow-x-hidden relative text-foreground transition-colors duration-300">

      {/* ── HERO ── */}
      <section className="relative h-[65vh] min-h-125 overflow-hidden">
        <Image src="/images/hero.png" alt="About Studio" fill priority sizes="100vw" className="object-cover" />
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
              Discover the narrative behind our workshop where passion meets precision.
            </p>
          </div>
        </div>
      </section>

      {/* ── INTRO ── */}
      <section className="px-6 md:px-12 lg:px-16 py-12 lg:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="py-16 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-32 items-start border-b border-black/5">
            <motion.div {...fade()} className="flex flex-col gap-10">
              <h2 className="font-black text-[2rem] md:text-[2.8rem] lg:text-[3.5rem] leading-[0.9] tracking-[-0.05em] m-0">
                Rooted in Craft. Driven by Heritage.
              </h2>
              <p className="text-foreground/60 text-lg leading-relaxed m-0 lg:max-w-md">
                EMPC-AMANI began as a humble carpentry workshop with a singular goal: to master the art of joinery and furniture design.
                Today, we stand as a beacon of artisanal excellence, blending traditional woodworking secrets with modern engineering.
                Our mission extends beyond furniture; we are a dedicated training ground for the next generation of master carpenters.
              </p>
              <div className="grid grid-cols-2 gap-12 pt-12 border-t border-border">
                <div>
                  <p className="font-black text-[2.5rem] lg:text-[3.5rem] tracking-[-0.05em] text-foreground m-0 leading-none">
                    <Counter value={250} suffix="+" />
                  </p>
                  <p className="text-[11px] font-black text-foreground/40 tracking-[0.2em] uppercase mt-4">Trained Artisans</p>
                </div>
                <div>
                  <p className="font-black text-[2.5rem] lg:text-[3.5rem] tracking-[-0.05em] text-foreground m-0 leading-none">
                    <Counter value={14} suffix="y" />
                  </p>
                  <p className="text-[11px] font-black text-foreground/40 tracking-[0.2em] uppercase mt-4">Of Heritage</p>
                </div>
              </div>
            </motion.div>
            <motion.div {...fade(0.1)} className="grid grid-cols-2 gap-4 lg:gap-6">
              <div className="relative rounded-[40px] overflow-hidden aspect-3/4 shadow-2xl">
                <Image src="/images/project1.png" alt="Detail" fill sizes="50vw" className="object-cover" />
              </div>
              <div className="relative rounded-[40px] overflow-hidden aspect-3/4 mt-12 shadow-2xl">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20 py-20 border-b border-border">
            {[
              { title: "Honest Materials", desc: "We only work with sustainably sourced timber, ensuring our impact on the earth is as beautiful as our work." },
              { title: "Lifelong Mastery", desc: "Our workshop is a school of life. We believe in continuous learning and the preservation of heritage skills." },
              { title: "Future Leaders", desc: "Through our partnership with RTB, we empower the youth with certified skills and real-world industrial experience." },
            ].map((v, i) => (
              <motion.div key={i} {...fade(i * 0.1)} className="flex flex-col gap-6 group">
                <div className="h-14 w-14 rounded-2xl glass flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-background transition-all duration-500">
                  <span className="font-black text-xl">0{i+1}</span>
                </div>
                <p className="font-black text-2xl text-foreground mb-3">{v.title}</p>
                <p className="text-foreground/60 leading-relaxed m-0">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section className="px-6 md:px-12 lg:px-16 pb-16">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            label="History"
            heading={<>Design Journey.</>}
            desc="From our founding in 2012 to today, each chapter has shaped our distinct design language."
          />
          <div className="py-12 grid grid-cols-1 lg:grid-cols-2 gap-20">
            <div className="flex flex-col">
              {milestones.map((m, i) => (
                <button
                  key={i}
                  onClick={() => setActiveMile(i)}
                  className={`text-left transition-all duration-500 py-6 border-b border-border flex justify-between items-center group ${activeMile === i ? "pl-4" : ""}`}
                >
                  <span className={`font-black text-3xl tracking-tighter ${activeMile === i ? "text-primary" : "text-foreground/20 group-hover:text-foreground/40"}`}>{m.year}</span>
                  <span className={`font-black text-sm uppercase tracking-widest ${activeMile === i ? "text-primary opacity-100" : "opacity-0 group-hover:opacity-40"}`}>{m.title}</span>
                </button>
              ))}
            </div>
            <div className="relative">
              <motion.div key={activeMile} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                <p className="text-foreground/60 text-lg leading-relaxed m-0">{milestones[activeMile].desc}</p>
                <div className="grid grid-cols-2 gap-6">
                  {milestones[activeMile].images.map((img, j) => (
                    <div key={j} className="relative rounded-3xl overflow-hidden aspect-4/3 shadow-lg">
                      <Image src={img} alt={milestones[activeMile].title} fill sizes="25vw" className="object-cover" />
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-6 md:px-12 lg:px-16 py-12 lg:py-20">
        <div className="pb-24">
          <div className="glass rounded-[64px] p-12 lg:p-24 text-center relative overflow-hidden shadow-3xl">
             <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_0%_0%,rgba(0,0,0,0.02)_0%,transparent_70%)]" />
             <div className="relative z-10 max-w-2xl mx-auto">
               <span className="font-black text-foreground uppercase tracking-[0.3em] text-[11px] mb-8 block">Join Us</span>
               <h2 className="font-black text-[2.8rem] md:text-[3.5rem] leading-[0.85] tracking-[-0.05em] text-foreground m-0 mb-10">
                 Experience the legacy of hand-crafted excellence.
               </h2>
               <Link href="/contact" className="inline-flex h-16 items-center px-12 rounded-full bg-primary text-background font-black hover:opacity-90 transition-all shadow-xl group">
                 Visit Workshop <ArrowUpRight size={20} className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
               </Link>
             </div>
          </div>
        </div>
      </section>

    </div>
  );
}
