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
    title: "Future of Sustainable Design",
    excerpt: "Exploring how eco-friendly materials are reshaping the modern home aesthetic in transformative ways.",
    date: "20.03.26",
    author: "Amani",
    category: "Eco Design",
    image: "/images/hero.png",
  },
  {
    title: "Minimalism vs. Maximalism",
    excerpt: "Which trend is right for your space? We deep dive into the pros and cons of both approaches.",
    date: "15.03.26",
    author: "Elena",
    category: "Trends",
    image: "/images/project1.png",
  },
  {
    title: "Color Psychology",
    excerpt: "How the right palette can boost team productivity and support mental well-being significantly.",
    date: "10.03.26",
    author: "Marco",
    category: "Psychology",
    image: "/images/project2.png",
  },
];

export default function Blog() {
  return (
    <div className="bg-white min-h-screen overflow-x-hidden relative text-[#111]">

      {/* ── HERO ── */}
      <section className="relative h-[60vh] min-h-[500px] overflow-hidden bg-black flex items-end">
        <div className="absolute inset-0 grayscale opacity-40">
          <Image src="/images/hero.png" alt="Journal" fill priority sizes="100vw" className="object-cover" />
        </div>
        <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.05)_0%,transparent_60%)]" />
        
        <div className="container mx-auto px-6 md:px-12 lg:px-16 pb-24 relative z-10 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as any }}
          >
            <span className="font-black text-white/50 uppercase tracking-[0.3em] text-[11px] mb-8 block">Studio Journal</span>
            <h1 className="font-black text-[3.5rem] md:text-[5.5rem] lg:text-[7rem] leading-[0.85] tracking-[-0.05em] text-white m-0">
              Latest<br />Insights.
            </h1>
          </motion.div>
        </div>
      </section>

      {/* ── GRID ── */}
      <section className="px-6 md:px-12 lg:px-16 py-32 container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 lg:gap-20">
          {posts.map((post, i) => (
            <motion.article key={i} {...fade(i * 0.1)} className="group flex flex-col gap-10">
              <Link href={`/blog/${post.title.toLowerCase().replace(/ /g, "-")}`} className="relative rounded-[40px] overflow-hidden aspect-[4/5] block shadow-3xl grayscale group-hover:grayscale-0 transition-all duration-1000">
                <Image src={post.image} alt={post.title} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover group-hover:scale-110 transition-transform duration-1000" />
                <div className="absolute top-8 left-8">
                  <span className="glass px-4 py-2 rounded-full text-[10px] font-black text-white uppercase tracking-widest">{post.category}</span>
                </div>
              </Link>
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4">
                  <p className="text-[11px] font-black text-black uppercase tracking-[0.2em] m-0">{post.date}</p>
                  <div className="h-[1px] w-8 bg-black/10" />
                  <p className="text-[11px] font-black text-[#aaa] uppercase tracking-[0.2em] m-0">{post.author}</p>
                </div>
                <Link href={`/blog/${post.title.toLowerCase().replace(/ /g, "-")}`} className="no-underline group/link">
                  <h2 className="font-black text-[2.5rem] leading-[1] tracking-[-0.05em] text-[#111] m-0 mb-4 group-hover/link:translate-x-2 transition-transform duration-500">
                    {post.title}
                  </h2>
                  <p className="text-[#555] text-lg leading-relaxed m-0 line-clamp-2">{post.excerpt}</p>
                </Link>
                <Link href={`/blog/${post.title.toLowerCase().replace(/ /g, "-")}`} className="inline-flex h-12 w-12 rounded-full glass items-center justify-center group-hover:bg-black group-hover:text-white transition-all shadow-sm text-[#111]">
                  <ArrowUpRight size={20} />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-6 md:px-12 lg:px-16 mb-48">
        <div className="max-w-7xl mx-auto">
          <div className="glass rounded-[64px] p-12 lg:p-24 overflow-hidden relative shadow-3xl text-center">
            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_100%_100%,rgba(0,0,0,0.02)_0%,transparent_70%)]" />
            <div className="relative z-10 max-w-2xl mx-auto text-center flex flex-col items-center">
              <h2 className="font-black text-[3rem] md:text-[4rem] leading-[0.85] tracking-[-0.05em] text-[#111] m-0 mb-10">
                Curated news delivered.<br />Design in focus.
              </h2>
              <div className="flex w-full max-w-md gap-4">
                <input type="email" placeholder="Email Address" className="h-16 flex-1 px-8 rounded-full border border-black/10 text-sm font-bold bg-white/50 focus:outline-none focus:border-black transition-colors" />
                <button className="h-16 w-16 bg-black text-white rounded-full flex items-center justify-center hover:bg-black transition-all shadow-lg active:scale-95">
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
