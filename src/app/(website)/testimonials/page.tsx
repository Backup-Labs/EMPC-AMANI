"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Testimonials } from "@/components/Testimonials";

// Shared section-label row (Responsive)
function SectionHeader({
  label,
  heading,
  desc,
}: {
  label: string;
  heading: React.ReactNode;
  desc?: string;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr_1fr] gap-10 lg:gap-16 py-12 lg:py-20 border-b border-border">
      {/* Label */}
      <div className="flex items-start gap-4 pt-2">
        <span className="w-2.5 h-2.5 rounded-full bg-primary shrink-0 mt-2 block" />
        <span className="font-black text-[14px] uppercase tracking-widest text-foreground">
          {label}
        </span>
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
      </div>
    </div>
  );
}

export default function TestimonialsPage() {
  return (
    <div className="bg-background min-h-screen overflow-x-hidden relative text-foreground transition-colors duration-300">
      {/* ── HERO ── */}
      <section className="relative h-[65vh] min-h-125 overflow-hidden">
        <Image
          src="/images/hero.png"
          alt="Testimonials"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
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
              Reviews.
            </motion.h1>
            <p className="text-white/80 text-lg md:text-xl leading-relaxed max-w-sm m-0">
              Honest stories from our valued customers and vocational graduates.
            </p>
          </div>
        </div>
      </section>

      {/* ── CONTENT SECTION ── */}
      <section className="px-6 md:px-12 lg:px-16 py-12 lg:py-20 container mx-auto max-w-7xl">
        <SectionHeader
          label="Testimonials"
          heading={
            <>
              Real Journeys.
              <br />
              Empowered Lives.
            </>
          }
          desc="Discover what our clients and alumni say about our bespoke woodwork and vocational training programs."
        />
        <Testimonials />
      </section>
    </div>
  );
}
