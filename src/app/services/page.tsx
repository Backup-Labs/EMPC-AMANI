"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

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

const services = [
  {
    num: "01",
    title: "Residential Visionary",
    desc: "Complete home interiors that reflect your style — functional, beautiful, and deeply personal.",
    stat: "120+",
    statLabel: "Harmonious Homes",
    image: "/images/hero.png",
  },
  {
    num: "02",
    title: "Commercial Excellence",
    desc: "Smart, branded spaces for offices, cafés, and retail that engage and perform.",
    stat: "45+",
    statLabel: "Dynamic Spaces",
    image: "/images/project1.png",
  },
  {
    num: "03",
    title: "Bespoke Renovation",
    desc: "We rework layouts, update materials, and give tired spaces a fresh, modern edge.",
    stat: "60+",
    statLabel: "Refined Modernity",
    image: "/images/project2.png",
  },
];

export default function Services() {
  return (
    <div className="bg-white min-h-screen overflow-x-hidden relative">

      {/* ── HERO ── */}
      <section className="relative h-[65vh] min-h-[500px] overflow-hidden">
        <Image src="/images/project2.png" alt="Our Services" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-linear-to-b from-black/60 via-transparent to-black/40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,0,0,0.05)_0%,transparent_60%)]" />
        
        {/* Hero Content */}
        <div className="absolute inset-x-0 bottom-0 pb-16 lg:pb-24 px-6 md:px-12 lg:px-16 container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as any }}
              className="font-black text-[3rem] md:text-[4.5rem] lg:text-[6.5rem] leading-[0.85] tracking-[-0.05em] text-white m-0"
            >
              Services.
            </motion.h1>
            <p className="text-white/80 text-lg md:text-xl leading-relaxed max-w-sm m-0">
              Expertly tailored design modules to suit every scale of architectural intervention.
            </p>
          </div>
        </div>
      </section>

      {/* ── LIST ── */}
      <section className="px-6 md:px-12 lg:px-16 pb-32">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            label="Expertise"
            heading={<>Tailored Care.<br />Inspired Living.</>}
            desc="Discover our modular approach to interior design that turns concepts into masterpieces."
          />
          
          <div className="flex flex-col">
            {services.map((s, i) => (
              <motion.div key={i} {...fade(i * 0.1)} className="py-20 lg:py-32 border-b border-black/5 group">
                <div className="grid grid-cols-1 lg:grid-cols-[150px_1fr_1fr] gap-12 lg:gap-24 mb-20 items-start">
                  <span className="font-black text-xl text-[#ccc] group-hover:text-black transition-colors m-0 tracking-widest">{s.num}</span>
                  <div className="flex flex-col gap-10">
                    <div>
                      <h3 className="font-black text-[2rem] md:text-[2.8rem] lg:text-[3.5rem] leading-[0.9] tracking-[-0.05em] text-[#111] m-0 mb-6 group-hover:translate-x-2 transition-transform duration-700">{s.title}</h3>
                      <p className="text-[#555] text-xl leading-relaxed m-0 max-w-lg">{s.desc}</p>
                    </div>
                    <div className="flex gap-16 items-center">
                      <div>
                        <p className="font-black text-[2.5rem] md:text-[3.5rem] tracking-[-0.05em] text-black m-0 leading-none">{s.stat}</p>
                        <p className="text-[11px] font-black text-[#aaa] tracking-[0.2em] uppercase mt-4">{s.statLabel}</p>
                      </div>
                      <Link href="/contact" className="h-16 w-16 glass rounded-full flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all shadow-sm">
                        <ArrowUpRight size={24} />
                      </Link>
                    </div>
                  </div>
                  <div className="relative rounded-[40px] overflow-hidden aspect-[4/3] shadow-3xl grayscale group-hover:grayscale-0 transition-all duration-1000">
                    <Image src={s.image} alt={s.title} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover group-hover:scale-110 transition-transform duration-1000" />
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
            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_100%_100%,rgba(0,0,0,0.02)_0%,transparent_70%)]" />
            <div className="relative z-10 max-w-2xl mx-auto">
              <span className="font-black text-black uppercase tracking-[0.3em] text-[11px] mb-8 block">Ready</span>
              <h2 className="font-black text-[2.8rem] md:text-[3.5rem] leading-[0.85] tracking-[-0.05em] text-[#111] m-0 mb-10">
                Begin your design journey today.
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
