"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Calendar, User } from "lucide-react";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 15 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.45, ease: "easeOut", delay },
});

const posts = [
  {
    title: "The Future of Sustainable Interior Design",
    excerpt: "Exploring how eco-friendly materials are reshaping the modern home aesthetic in transformative ways.",
    date: "March 20, 2026",
    author: "Amani",
    category: "Sustainability",
    image: "/images/hero.png",
  },
  {
    title: "Minimalism vs. Maximalism in 2026",
    excerpt: "Which trend is right for your space? We deep dive into the pros and cons of both approaches.",
    date: "March 15, 2026",
    author: "Elena",
    category: "Trends",
    image: "/images/project1.png",
  },
  {
    title: "Color Psychology in Workspaces",
    excerpt: "How the right palette can boost team productivity and support mental well-being significantly.",
    date: "March 10, 2026",
    author: "Marco",
    category: "Psychology",
    image: "/images/project2.png",
  },
  {
    title: "Biophilic Design: Bringing Nature Indoors",
    excerpt: "Why incorporating natural elements into your interior design improves mood, health and creativity.",
    date: "March 5, 2026",
    author: "Amani",
    category: "Biophilic",
    image: "/images/hero.png",
  },
  {
    title: "How to Style a Small Living Room",
    excerpt: "Clever design strategies that make even the most compact spaces feel open, airy and inviting.",
    date: "Feb 28, 2026",
    author: "Elena",
    category: "Tips",
    image: "/images/project1.png",
  },
  {
    title: "The Art of Layering Textures",
    excerpt: "Master the craft of combining textiles, metals, and natural materials for tactile-rich interiors.",
    date: "Feb 20, 2026",
    author: "Marco",
    category: "Styling",
    image: "/images/project2.png",
  },
];

export default function Blog() {
  return (
    <div className="bg-[#f0f0f0] min-h-screen">

      {/* ── HERO ── */}
      <section className="bg-[#111] pt-32 md:pt-40 pb-16 lg:pb-24 px-6 md:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-2 mb-6">
              <span className="w-2 h-2 rounded-full bg-[#555] block" />
              <span className="font-medium text-[13px] text-[#777]">Our Blog</span>
            </div>
            <h1 className="font-extrabold text-[2.8rem] md:text-[4.5rem] lg:text-[6rem] leading-[0.95] tracking-[-0.04em] text-white m-0">
              Insights &amp;<br />Inspiration.
            </h1>
            <p className="text-white/45 text-sm md:text-base leading-relaxed mt-6 max-w-sm m-0">
              Design insights, trends, and inspiration from the studio of EMPC-AMANI.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── BLOG GRID ── */}
      <section className="px-6 md:px-12 lg:px-16 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 lg:gap-12">
            {posts.map((post, i) => (
              <motion.article key={i} {...fade(i * 0.06)} className="flex flex-col gap-6 group">
                {/* Image */}
                <Link href={`/blog/${post.title.toLowerCase().replace(/ /g, "-")}`} className="relative rounded-2xl md:rounded-3xl overflow-hidden aspect-[16/10] block group shadow-sm">
                  <Image src={post.image} alt={post.title} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                  <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md rounded-full px-4 py-1.5 border border-white/10">
                    <span className="text-white text-[10px] font-bold tracking-widest uppercase">{post.category}</span>
                  </div>
                </Link>
                {/* Meta */}
                <div className="flex gap-6 items-center">
                  <span className="text-[#888] text-[11px] font-bold flex items-center gap-1.5 uppercase tracking-wider">
                    <Calendar size={12} /> {post.date}
                  </span>
                  <span className="text-[#888] text-[11px] font-bold flex items-center gap-1.5 uppercase tracking-wider">
                    <User size={12} /> {post.author}
                  </span>
                </div>
                {/* Text */}
                <div className="flex flex-col gap-3">
                  <Link href={`/blog/${post.title.toLowerCase().replace(/ /g, "-")}`} className="no-underline">
                    <h2 className="font-bold text-lg lg:text-xl leading-tight tracking-tight text-[#111] hover:underline underline-offset-4 decoration-1">
                      {post.title}
                    </h2>
                  </Link>
                  <p className="text-[#666] text-sm md:text-[15px] leading-relaxed m-0 line-clamp-3">{post.excerpt}</p>
                </div>
                <Link href={`/blog/${post.title.toLowerCase().replace(/ /g, "-")}`} className="inline-flex items-center gap-1.5 font-bold text-xs lg:text-sm text-[#111] border-b border-[#111] pb-1 w-fit mt-1 hover:gap-2.5 transition-all">
                  Read More <ArrowUpRight size={14} />
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
