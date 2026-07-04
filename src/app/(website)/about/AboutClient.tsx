"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Counter } from "@/components/AnimatedComponents";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CTASection } from "@/components/ui/CTASection";
import { fadeIn } from "@/lib/motion";
import type { SiteContent } from "@/lib/cms/settings";

export function AboutClient({ content }: { content: SiteContent }) {
  const [activeMile, setActiveMile] = useState(0);
  const milestones = content.milestones.length ? content.milestones : [];
  const safeIndex = milestones.length ? Math.min(activeMile, milestones.length - 1) : 0;
  const active = milestones[safeIndex];

  return (
    <div className="bg-background min-h-screen overflow-x-hidden relative text-foreground transition-colors duration-300">
      <PageHero
        image="/images/hero.png"
        alt="About Studio"
        title="Our Story."
        subtitle="Discover the narrative behind our workshop where passion meets precision."
      />

      <section className="px-6 md:px-12 lg:px-16 py-8 lg:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="py-8 md:py-10 grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-start border-b border-border">
            <motion.div {...fadeIn()} className="flex flex-col gap-6">
              <h2 className="font-black text-[2rem] md:text-[2.8rem] lg:text-[3.5rem] leading-[0.9] tracking-[-0.05em] m-0">
                {content.about_heading}
              </h2>
              <p className="text-foreground/60 text-lg leading-relaxed m-0 lg:max-w-md">
                {content.about_intro}
              </p>
              <div className="grid grid-cols-2 gap-12 pt-12 border-t border-border">
                <div>
                  <p className="font-black text-[2.5rem] lg:text-[3.5rem] tracking-[-0.05em] text-foreground m-0 leading-none">
                    <Counter value={content.about_stat_artisans} suffix="+" />
                  </p>
                  <p className="text-[11px] font-black text-foreground/40 tracking-[0.2em] uppercase mt-4">Trained Artisans</p>
                </div>
                <div>
                  <p className="font-black text-[2.5rem] lg:text-[3.5rem] tracking-[-0.05em] text-foreground m-0 leading-none">
                    <Counter value={content.about_stat_heritage} suffix="y" />
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

      <section className="px-6 md:px-12 lg:px-16 bg-muted relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(0,0,0,0.02)_0%,transparent_50%)]" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 py-10 border-b border-border">
            {content.about_values.map((v, i) => (
              <motion.div key={i} {...fadeIn(i * 0.08)} className="card-elevated p-5 flex flex-col gap-4 group">
                <div className="h-14 w-14 rounded-2xl glass flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-background transition-all duration-500">
                  <span className="font-black text-xl">0{i + 1}</span>
                </div>
                <p className="font-black text-2xl text-foreground mb-3">{v.title}</p>
                <p className="text-foreground/60 leading-relaxed m-0">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 md:px-12 lg:px-16 pb-16">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            label="History"
            heading={<>Design Journey.</>}
            desc="From our founding to today, each chapter has shaped our distinct design language."
          />
          {milestones.length === 0 ? (
            <p className="text-sm text-foreground/50 text-center py-12">No milestones configured yet.</p>
          ) : (
            <div className="py-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="flex flex-col">
                {milestones.map((m, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveMile(i)}
                    className={`text-left transition-all duration-500 py-6 border-b border-border flex justify-between items-center group ${safeIndex === i ? "pl-4" : ""}`}
                  >
                    <span className={`font-black text-3xl tracking-tighter ${safeIndex === i ? "text-primary" : "text-foreground/20 group-hover:text-foreground/40"}`}>{m.year}</span>
                    <span className={`font-black text-sm uppercase tracking-widest ${safeIndex === i ? "text-primary opacity-100" : "opacity-0 group-hover:opacity-40"}`}>{m.title}</span>
                  </button>
                ))}
              </div>
              <div className="relative">
                {active && (
                  <motion.div key={safeIndex} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                    <p className="text-foreground/60 text-lg leading-relaxed m-0">{active.desc}</p>
                    <div className="grid grid-cols-2 gap-6">
                      {active.images.map((img, j) => (
                        <div key={j} className="relative rounded-3xl overflow-hidden aspect-4/3 shadow-lg">
                          <Image src={img} alt={active.title} fill sizes="25vw" className="object-cover" />
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      <CTASection title="Experience the legacy of hand-crafted excellence." buttonText="Visit Workshop" buttonHref="/contact" />
    </div>
  );
}
