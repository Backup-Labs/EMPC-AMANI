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

const services = [
  {
    num: "(001)",
    title: "Residential Design",
    desc: "Complete home interiors that reflect your style — functional, beautiful, and deeply personal.",
    stat: "90+",
    statLabel: "Transformed Spaces",
    image: "/images/hero.png",
  },
  {
    num: "(002)",
    title: "Commercial Interior Design",
    desc: "Smart, branded spaces for offices, cafés, and retail that engage and perform.",
    stat: "40+",
    statLabel: "Transformed Spaces",
    image: "/images/project1.png",
  },
  {
    num: "(003)",
    title: "Interior Renovations",
    desc: "We rework layouts, update materials, and give tired spaces a fresh, modern edge.",
    stat: "30+",
    statLabel: "Transformed Spaces",
    image: "/images/project2.png",
  },
  {
    num: "(004)",
    title: "Styling & Decor",
    desc: "The finishing touches that complete a space — furniture, lighting, textiles, and art.",
    stat: "75+",
    statLabel: "Styled Homes",
    image: "/images/hero.png",
  },
  {
    num: "(005)",
    title: "Virtual Design",
    desc: "Full-service remote design with detailed 3D renders and guided shopping lists.",
    stat: "35+",
    statLabel: "Remote Clients",
    image: "/images/project1.png",
  },
];

export default function Services() {
  return (
    <div className="bg-[#f0f0f0] min-h-screen">

      {/* ── HERO ── */}
      <section className="relative h-[52vh] min-h-[350px] overflow-hidden">
        <Image src="/images/project2.png" alt="Our Services" fill sizes="100vw" priority className="object-cover" />
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-x-0 bottom-0 px-6 md:px-12 lg:px-16 pb-12 lg:pb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-10 text-white">
          <h1 className="font-extrabold text-[2.8rem] md:text-[4.5rem] lg:text-[6rem] leading-[0.95] tracking-[-0.04em] m-0">
            Our Services
          </h1>
          <p className="text-white/70 text-sm md:text-base leading-relaxed max-w-sm m-0">
            Explore our tailored design services crafted to reflect comfort, beauty, and purpose.
          </p>
        </div>
      </section>

      {/* ── SECTION INTRO ── */}
      <section className="px-6 md:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            label="Services"
            heading={<>Personalized Care.<br />Inspired Spaces.</>}
            right={<p className="text-sm text-[#666] leading-relaxed max-w-sm m-0">Discover our range of interior designs that turn ideas into stunning spaces!</p>}
          />
        </div>
      </section>

      {/* ── SERVICE LIST ── */}
      <section className="px-6 md:px-12 lg:px-16 pb-16 lg:pb-24">
        <div className="max-w-7xl mx-auto">
          {services.map((s, i) => (
            <motion.div key={i} {...fade(0)} className="border-b border-[#e0e0e0] pb-12 lg:pb-16 mt-10 md:mt-16">
              {/* Row: number + title/desc/stat */}
              <div className="grid grid-cols-1 lg:grid-cols-[180px_1fr_1fr] gap-6 lg:gap-10 mb-8 md:mb-12">
                <span className="font-bold text-[13px] text-[#888] lg:pt-1">{s.num}</span>
                <div className="flex flex-col gap-6 md:gap-8">
                  <div className="flex flex-col gap-4">
                    <h3 className="font-bold text-[1.8rem] md:text-[2rem] leading-tight tracking-tight m-0">{s.title}</h3>
                    <p className="text-[#666] text-[15px] leading-relaxed m-0 max-w-md">{s.desc}</p>
                  </div>
                  <div>
                    <p className="font-extrabold text-[2.2rem] md:text-[2.6rem] tracking-[-0.04em] m-0 leading-none">{s.stat}</p>
                    <p className="text-[10px] md:text-[11px] font-bold tracking-[0.14em] text-[#888] uppercase mt-2">{s.statLabel}</p>
                  </div>
                </div>
                <div className="flex justify-start lg:justify-end items-start pt-2">
                  <Link href="/contact" className="inline-flex items-center gap-2 font-bold text-xs md:text-sm text-[#111] border border-[#c8c8c8] rounded-full px-6 py-3 hover:bg-[#111] hover:text-white transition-all">
                    Enquire <ArrowUpRight size={14} />
                  </Link>
                </div>
              </div>
              {/* Image with hover */}
              <div className="relative rounded-3xl overflow-hidden aspect-[16/9] lg:aspect-[21/9] group cursor-pointer shadow-sm">
                <Image src={s.image} alt={s.title} fill sizes="(max-width:1280px) 100vw, 1280px" className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
              </div>
            </motion.div>
          ))}
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
              <Image src="/images/project1.png" alt="CTA" fill sizes="50vw" className="object-cover group-hover:scale-105 transition-transform duration-700" />
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
