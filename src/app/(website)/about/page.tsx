"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Counter } from "@/components/AnimatedComponents";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CTASection } from "@/components/ui/CTASection";
import { fadeIn } from "@/lib/motion";

const milestones = [
  { year: "1990", title: "Workshop Founded", desc: "EMPC-AMANI begins with two benches and a passion for solid wood.", images: ["/images/hero.png", "/images/project1.png"] },
  { year: "2010", title: "Industrial Expansion", desc: "Scale production for boutique hotels and luxury offices began.", images: ["/images/project2.png", "/images/hero.png"] },
  { year: "2020", title: "Vocational Partnership", desc: "Launched our first student certification program with RTB.", images: ["/images/project1.png", "/images/project2.png"] },
  { year: "2021", title: "Mastery Hub", desc: "Expanding our campus to become the premier carpentry training hub.", images: ["/images/hero.png", "/images/project1.png"] },
];

// Shared section-label row removed — using @/components/ui/SectionHeader


export default function About() {
  const [activeMile, setActiveMile] = useState(0);

  return (
    <div className="bg-background min-h-screen overflow-x-hidden relative text-foreground transition-colors duration-300">

      <PageHero
        image="/images/hero.png"
        alt="About Studio"
        title="Our Story."
        subtitle="Discover the narrative behind our workshop where passion meets precision."
      />

      {/* Intro */}
      <section className="px-6 md:px-12 lg:px-16 py-8 lg:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="py-8 md:py-10 grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-start border-b border-border">
            <motion.div {...fadeIn()} className="flex flex-col gap-6">
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
            <motion.div {...fadeIn(0.1)} className="grid grid-cols-2 gap-3 lg:gap-4">
              <div className="relative rounded-2xl overflow-hidden aspect-[3/4] shadow-md">
                <Image src="/images/project1.png" alt="Detail" fill sizes="50vw" className="object-cover" />
              </div>
              <div className="relative rounded-2xl overflow-hidden aspect-[3/4] mt-8 shadow-md">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 py-10 border-b border-border">
            {[
              { title: "Honest Materials", desc: "We only work with sustainably sourced timber, ensuring our impact on the earth is as beautiful as our work." },
              { title: "Lifelong Mastery", desc: "Our workshop is a school of life. We believe in continuous learning and the preservation of heritage skills." },
              { title: "Future Leaders", desc: "Through our partnership with RTB, we empower the youth with certified skills and real-world industrial experience." },
            ].map((v, i) => (
              <motion.div key={i} {...fadeIn(i * 0.08)} className="card-elevated p-5 flex flex-col gap-4 group">
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
          <div className="py-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
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

      <CTASection
        title="Experience the legacy of hand-crafted excellence."
        buttonText="Visit Workshop"
        buttonHref="/contact"
      />

    </div>
  );
}
