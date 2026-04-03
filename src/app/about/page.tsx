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
  transition: { duration: 0.5, ease: "easeOut", delay },
});

// Shared Responsive Section Header
function SectionHeader({ label, heading, right }: { label: string; heading: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[180px_1fr_1fr] gap-6 lg:gap-8 py-10 lg:py-14 border-b border-[#e0e0e0]">
      <div className="flex items-start gap-2 pt-1">
        <span className="w-2 h-2 rounded-full bg-[#111] shrink-0 mt-1.5 block" />
        <span className="font-medium text-[13px] text-[#111]">{label}</span>
      </div>
      <h2 className="font-bold text-[1.6rem] md:text-[2.2rem] lg:text-[2.5rem] leading-[1.1] tracking-[-0.03em] text-[#111] m-0">
        {heading}
      </h2>
      <div className="flex flex-col justify-start">{right}</div>
    </div>
  );
}

const values = [
  { title: "Our Case", desc: "Crafting beautiful spaces that reflect your personality and your story.", icon: ShieldCheck },
  { title: "Our Vision", desc: "To be the benchmark for excellence in high-end interior design globally.", icon: Target },
  { title: "Commitment", desc: "We deliver on time, every time, with zero compromises on quality.", icon: CheckCircle },
];

const milestones = [
  { year: "2010", title: "Studio Founded", desc: "EMPC-AMANI begins with a small team and a bold design vision.", images: ["/images/hero.png", "/images/project1.png"] },
  { year: "2015", title: "Creative Growth", desc: "Expanded into commercial and hospitality design projects worldwide.", images: ["/images/project2.png", "/images/hero.png"] },
  { year: "2020", title: "Global Reach", desc: "Started delivering projects across three continents seamlessly.", images: ["/images/project1.png", "/images/project2.png"] },
  { year: "Now", title: "New Chapter", desc: "Leading luxury design with an innovative, human-centred approach.", images: ["/images/hero.png", "/images/project1.png"] },
];

const awards = [
  { num: "01", title: "Design Excellence Award", org: "Architecture Today", year: "2023" },
  { num: "02", title: "Creative Business Design Award", org: "Design Week", year: "2022" },
  { num: "03", title: "Innovation in Design Award", org: "Interior Design Mag", year: "2021" },
];

const team = [
  { name: "Amani", role: "Principal Designer", image: "/images/hero.png" },
  { name: "Marco Silva", role: "Architect", image: "/images/project1.png" },
  { name: "Elena Park", role: "Project Manager", image: "/images/project2.png" },
  { name: "Justin Brown", role: "Lead Stylist", image: "/images/hero.png" },
];

const clients = ["DXB", "FABBRO", "LUXE.LAB", "Georg Jensen", "OSSIO", "ARTEK"];

export default function About() {
  return (
    <div className="bg-[#f0f0f0] min-h-screen">

      {/* ── HERO ── */}
      <section className="relative h-[52vh] min-h-[350px] overflow-hidden">
        <Image src="/images/hero.png" alt="About Us" fill sizes="100vw" priority className="object-cover" />
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-x-0 bottom-0 px-6 md:px-12 lg:px-16 pb-12 lg:pb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-10">
          <h1 className="font-extrabold text-[2.8rem] md:text-[4.5rem] lg:text-[6rem] leading-[0.95] tracking-[-0.04em] text-white m-0">
            About Us
          </h1>
          <p className="text-white/70 text-sm md:text-base leading-relaxed max-w-sm m-0">
            Discover the story of our studio where passion meets purpose and values.
          </p>
        </div>
      </section>

      {/* ── INTRO ── */}
      <section className="px-6 md:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto border-b border-[#e0e0e0]">
          <div className="py-12 md:py-20 lg:py-24 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-start">
            <motion.div {...fade()} className="flex flex-col gap-6 md:gap-8">
              <h2 className="font-bold text-[1.8rem] md:text-[2.2rem] lg:text-[2.8rem] leading-[1.1] tracking-[-0.03em] m-0">
                Rooted in Clear Vision. Driven by Detail.
              </h2>
              <p className="text-[#555] text-[15px] leading-relaxed m-0 lg:max-w-md">
                Since day one, we&#39;ve believed that spaces and people shape each other.
                What started as a small design studio has grown into a full-service interior
                design firm. EMPC-AMANI crafts interiors that are deeply personal, functional,
                and beautifully executed from concept to completion.
              </p>
              <div className="grid grid-cols-2 gap-8 pt-8 border-t border-[#e0e0e0]">
                <div>
                  <p className="font-extrabold text-[2.2rem] lg:text-[2.8rem] tracking-[-0.04em] m-0 leading-none">120+</p>
                  <p className="text-[10px] font-bold text-[#888] tracking-[0.14em] uppercase mt-2">Happy Customers</p>
                </div>
                <div>
                  <p className="font-extrabold text-[2.2rem] lg:text-[2.8rem] tracking-[-0.04em] m-0 leading-none">2,000+</p>
                  <p className="text-[10px] font-bold text-[#888] tracking-[0.14em] uppercase mt-2">Sq Ft Designed</p>
                </div>
              </div>
            </motion.div>
            <motion.div {...fade(0.1)} className="grid grid-cols-2 gap-3 lg:gap-4">
              <div className="relative rounded-2xl overflow-hidden aspect-[3/4]">
                <Image src="/images/project1.png" alt="Detail" fill sizes="50vw" className="object-cover" />
              </div>
              <div className="relative rounded-2xl overflow-hidden aspect-[3/4]">
                <Image src="/images/project2.png" alt="Space" fill sizes="50vw" className="object-cover" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── OUR CLIENTS ── */}
      <section className="px-6 md:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto border-b border-[#e0e0e0]">
          <div className="py-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-16">
            <span className="font-medium text-[13px] text-[#888] shrink-0">Our Clients</span>
            <div className="flex flex-wrap gap-x-8 gap-y-4 md:gap-x-12 lg:gap-x-16 items-center">
              {clients.map((c) => (
                <span key={c} className="font-bold text-[14px] lg:text-[15px] text-[#aaa] tracking-widest uppercase">{c}</span>
              ))}
            </div>
            <Link href="/projects" className="font-bold text-[12px] text-[#888] flex items-center gap-1.5 whitespace-nowrap hover:text-[#111] transition-colors">
              All Projects <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="px-6 md:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            label="Values"
            heading={<>Driven by purpose<br />&amp; principles.</>}
            right={<p className="text-sm text-[#666] leading-relaxed max-w-sm">Our core values define every project we undertake from day one.</p>}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 py-10 lg:py-16">
            {values.map((v, i) => (
              <motion.div key={i} {...fade(i * 0.08)} className="bg-white rounded-3xl p-8 lg:p-10 flex flex-col gap-6 group hover:shadow-xl transition-all duration-500">
                <div className="h-12 w-12 rounded-2xl bg-[#f0f0f0] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <v.icon size={22} className="text-[#111]" />
                </div>
                <p className="font-bold text-lg text-[#111] m-0">{v.title}</p>
                <p className="text-[#666] text-sm md:text-[15px] leading-relaxed m-0">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section className="px-6 md:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            label="History"
            heading={<>A Clear, Thoughtful<br />Design Journey</>}
            right={<p className="text-sm text-[#666] leading-relaxed max-w-sm">From our founding to today, each chapter has shaped who we are.</p>}
          />
          <div className="py-10 lg:py-16 flex flex-col">
            {milestones.map((m, i) => (
              <motion.div key={i} {...fade(i * 0.06)}
                className="grid grid-cols-1 lg:grid-cols-[100px_1fr_1fr] gap-6 lg:gap-12 items-center py-10 lg:py-14 border-b border-[#e0e0e0]">
                <p className="font-bold text-[13px] text-[#888] tracking-widest uppercase m-0">{m.year}</p>
                <div className="max-w-md">
                  <p className="font-bold text-lg md:text-xl text-[#111] mb-2">{m.title}</p>
                  <p className="text-[#666] text-sm md:text-[15px] leading-relaxed m-0">{m.desc}</p>
                </div>
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  {m.images.map((img, j) => (
                    <div key={j} className="relative rounded-xl md:rounded-2xl overflow-hidden aspect-[4/3]">
                      <Image src={img} alt={m.title} fill sizes="25vw" className="object-cover" />
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RECOGNITION ── */}
      <section className="px-6 md:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            label="Recognition"
            heading={<>Recognized Craft.<br />Celebrated Creativity.</>}
            right={<p className="text-sm text-[#666] leading-relaxed max-w-sm">Our work has been recognized by leading design institutions worldwide.</p>}
          />
          <div className="py-8 lg:py-12">
            {awards.map((a, i) => (
              <motion.div key={i} {...fade(i * 0.06)}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-8 border-b border-[#e0e0e0] gap-4">
                <div className="flex gap-6 lg:gap-10 items-center">
                  <span className="text-[#ccc] font-bold text-lg min-w-[32px]">{a.num}</span>
                  <div>
                    <p className="font-bold text-[16px] lg:text-[18px] text-[#111] m-0 leading-tight">{a.title}</p>
                    <p className="text-[#888] text-sm mt-1.5 font-medium">{a.org}</p>
                  </div>
                </div>
                <span className="text-[#aaa] text-sm font-bold tracking-widest">{a.year}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section className="px-6 md:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            label="Our People"
            heading={<>Collaborative Spirit,<br />Collective Vision.</>}
            right={<p className="text-sm text-[#666] leading-relaxed max-w-sm">Meet the talented designers and architects behind EMPC-AMANI.</p>}
          />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 py-10 lg:py-20">
            {team.map((t, i) => (
              <motion.div key={i} {...fade(i * 0.07)} className="flex flex-col gap-4 group">
                <div className="relative rounded-2xl md:rounded-3xl overflow-hidden aspect-[3/4] sm:grayscale hover:grayscale-0 transition-all duration-700 ease-in-out cursor-pointer">
                  <Image src={t.image} alt={t.name} fill sizes="(max-width:768px) 50vw, 25vw" className="object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div>
                  <p className="font-bold text-base md:text-lg text-[#111] leading-tight mb-1 m-0">{t.name}</p>
                  <p className="text-[#888] text-[10px] md:text-[11px] font-bold tracking-widest uppercase m-0">{t.role}</p>
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
            right={<p className="text-sm text-[#666] leading-relaxed max-w-sm">Interested in working with us? Let&apos;s bring your space to life.</p>}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 py-10 lg:py-14">
            <div className="relative rounded-3xl overflow-hidden aspect-[16/9] md:aspect-auto group cursor-pointer">
              <Image src="/images/project2.png" alt="CTA" fill sizes="50vw" className="object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/30" />
              <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 text-white font-bold text-lg md:text-xl tracking-tight">Step Into Your Dream Space</div>
            </div>
            <div className="bg-white rounded-3xl p-10 lg:p-16 flex flex-col gap-6 justify-center shadow-xs">
              <p className="text-[10px] md:text-[11px] font-bold tracking-[0.16em] text-[#888] uppercase m-0">Let&apos;s create</p>
              <p className="text-[#555] text-base lg:text-lg leading-relaxed m-0">
                Let&apos;s create something truly incredible together. Your ideal space begins right here with us.
              </p>
              <Link href="/contact" className="inline-flex items-center gap-1.5 font-bold text-sm lg:text-base text-[#111] hover:underline underline-offset-8 decoration-2 mt-4">
                Contact Us <ArrowUpRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
