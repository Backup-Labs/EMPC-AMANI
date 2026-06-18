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

const posts = [
  {
    title: "The Heritage of Wood",
    excerpt: "Exploring how traditional timber joinery is reshaping the modern home aesthetic with soul and longevity.",
    date: "20.03.26",
    author: "Amani",
    category: "Craftsmanship",
    image: "/images/hero.png",
  },
  {
    title: "Art of Joinery",
    excerpt: "Dovetails and tenons: we deep dive into the pros and cons of traditional vs. modern assembly techniques.",
    date: "15.03.26",
    author: "Elena",
    category: "Technique",
    image: "/images/project1.png",
  },
  {
    title: "Workshop Milestones",
    excerpt: "Reflecting on our 14-year journey from two workbenches to a premier vocational training hub.",
    date: "10.03.26",
    author: "Marco",
    category: "Heritage",
    image: "/images/project2.png",
  },
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

export default function News() {
  return (
    <div className="bg-background min-h-screen overflow-x-hidden relative text-foreground transition-colors duration-300">

      {/* ── HERO ── */}
      <section className="relative h-[65vh] min-h-125 overflow-hidden">
        <Image src="/images/hero.png" alt="News" fill priority sizes="100vw" className="object-cover" />
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
              Latest<br />Insights.
            </motion.h1>
            <p className="text-white/80 text-lg md:text-xl leading-relaxed max-w-sm m-0">
              Discover the latest stories from our workshop, where tradition meets modern innovation.
            </p>
          </div>
        </div>
      </section>

      {/* ── GRID ── */}
      <section className="px-6 md:px-12 lg:px-16 py-12 lg:py-20 container mx-auto max-w-7xl">
        <SectionHeader
          label="Stories"
          heading={<>The Workshop<br />Chronicles.</>}
          desc="Insights into our process, our heritage, and the future of artisanal craftsmanship."
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 lg:gap-20 pt-20">
          {posts.map((post, i) => (
            <motion.article key={i} {...fade(i * 0.1)} className="group flex flex-col gap-10">
              <Link href={`/news/${post.title.toLowerCase().replace(/ /g, "-")}`} className="relative rounded-[40px] overflow-hidden aspect-4/5 block shadow-3xl transition-all duration-1000">
                <Image src={post.image} alt={post.title} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover group-hover:scale-110 transition-transform duration-1000" />
                <div className="absolute top-8 left-8">
                  <span className="glass px-4 py-2 rounded-full text-[10px] font-black text-white uppercase tracking-widest">{post.category}</span>
                </div>
              </Link>
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4">
                  <p className="text-[11px] font-black text-foreground uppercase tracking-[0.2em] m-0">{post.date}</p>
                  <div className="h-px w-8 bg-border" />
                  <p className="text-[11px] font-black text-foreground/40 uppercase tracking-[0.2em] m-0">{post.author}</p>
                </div>
                <Link href={`/news/${post.title.toLowerCase().replace(/ /g, "-")}`} className="no-underline group/link">
                  <h2 className="font-black text-[2.5rem] leading-none tracking-[-0.05em] text-foreground m-0 mb-4 group-hover/link:translate-x-2 transition-transform duration-500">
                    {post.title}
                  </h2>
                  <p className="text-foreground/60 text-lg leading-relaxed m-0 line-clamp-2">{post.excerpt}</p>
                </Link>
                <Link href={`/news/${post.title.toLowerCase().replace(/ /g, "-")}`} className="inline-flex h-12 w-12 rounded-full glass items-center justify-center group-hover:bg-primary group-hover:text-background transition-all shadow-sm text-foreground">
                  <ArrowUpRight size={20} />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-6 md:px-12 lg:px-16 mb-24">
        <div className="max-w-7xl mx-auto">
          <div className="glass rounded-[64px] p-12 lg:p-24 overflow-hidden relative shadow-3xl text-center">
            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_100%_100%,rgba(0,0,0,0.02)_0%,transparent_70%)]" />
            <div className="relative z-10 max-w-2xl mx-auto text-center flex flex-col items-center">
              <h2 className="font-black text-[3rem] md:text-[4rem] leading-[0.85] tracking-[-0.05em] text-foreground m-0 mb-10">
                Curated news delivered.<br />Design in focus.
              </h2>
              <div className="flex w-full max-w-md gap-4">
                <input type="email" placeholder="Email Address" className="h-16 flex-1 px-8 rounded-full border border-border text-sm font-bold bg-background/50 focus:outline-none focus:border-primary transition-colors" />
                <button className="h-16 w-16 bg-primary text-background rounded-full flex items-center justify-center hover:opacity-90 transition-all shadow-lg active:scale-95">
                  <ArrowUpRight size={24} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
