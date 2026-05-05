"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { useParams } from "next/navigation";

// Mock data for blog details
const blogData: Record<string, any> = {
  "heritage-of-wood": {
    title: "The Heritage of Wood",
    date: "20.03.26",
    author: "Amani",
    category: "Craftsmanship",
    image: "/images/hero.png",
    content: [
      { type: "p", text: "Working with timber is a conversation with time. At EMPC-AMANI, we believe that every knot and grain pattern in the wood tells a story of the forest it came from." },
      { type: "h2", text: "The Master's Touch" },
      { type: "p", text: "Traditional joinery—without screws or nails—remains the gold standard of high-end carpentry. Our artisans spend years mastering dovetails and mortise-and-tenon joints to ensure every piece of furniture lasts for generations." },
      { type: "image", src: "/images/project1.png" },
      { type: "p", text: "But craftsmanship isn't just about the past. We integrate modern precision tools to achieve tolerances that were once impossible, creating a perfect marriage of old-world soul and new-world accuracy." }
    ]
  }
};

export default function NewsDetail() {
  const params = useParams();
  const slug = params?.slug as string;
  const blog = blogData[slug] || blogData["heritage-of-wood"];

  return (
    <div className="bg-background min-h-screen overflow-x-hidden relative text-foreground transition-colors duration-300">
      {/* ── HEADER ── */}
      <section className="pt-32 md:pt-40 lg:pt-48 pb-12 lg:pb-20 px-6 md:px-12 lg:px-16 container mx-auto max-w-7xl">
        <div className="flex flex-col items-center text-center">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" as any }}>
            <Link href="/news" className="inline-flex items-center gap-2 font-black text-[11px] text-foreground/40 uppercase tracking-widest mb-12 hover:text-foreground transition-colors group">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to News
            </Link>
            
            <div className="flex flex-wrap justify-center gap-8 items-center mb-8">
              <span className="text-foreground text-[11px] font-black flex items-center gap-2 uppercase tracking-[0.2em]">
                {blog.date}
              </span>
              <div className="h-1 w-1 rounded-full bg-border" />
              <span className="text-foreground/40 text-[11px] font-black flex items-center gap-2 uppercase tracking-[0.2em]">
                {blog.author}
              </span>
              <div className="h-1 w-1 rounded-full bg-border" />
              <span className="glass px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase text-foreground">
                {blog.category}
              </span>
            </div>

            <h1 className="font-black text-[2.8rem] md:text-[4.5rem] lg:text-[5.5rem] leading-[0.9] tracking-[-0.05em] text-foreground m-0 max-w-4xl mx-auto">
              {blog.title}
            </h1>
          </motion.div>
        </div>
      </section>

      {/* ── HERO IMAGE ── */}
      <section className="px-6 md:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="relative rounded-[48px] overflow-hidden aspect-[16/9] lg:aspect-[21/9] shadow-3xl grayscale group hover:grayscale-0 transition-all duration-1000">
            <Image src={blog.image} alt={blog.title} fill sizes="100vw" priority className="object-cover" />
          </div>
        </div>
      </section>

      {/* ── CONTENT ── */}
      <section className="px-6 md:px-12 lg:px-16 py-32">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col gap-12 md:gap-16">
            {blog.content?.map((item: any, i: number) => {
              if (item.type === "h2") return (
                <h2 key={i} className="font-black text-[2rem] md:text-[2.8rem] tracking-[-0.05em] leading-[1] m-0 mt-12 text-foreground">
                  {item.text}
                </h2>
              );
              if (item.type === "p") return (
                <p key={i} className="text-foreground/60 text-lg md:text-xl leading-relaxed m-0 text-balance">
                  {item.text}
                </p>
              );
              if (item.type === "image") return (
                <div key={i} className="relative rounded-[40px] overflow-hidden aspect-[16/10] my-12 shadow-3xl grayscale hover:grayscale-0 transition-all duration-1000">
                  <Image src={item.src} alt="Article Detail" fill sizes="(max-width:768px) 100vw, 800px" className="object-cover" />
                </div>
              );
              return null;
            })}
          </div>

          {/* Social Share / Footer */}
          <div className="mt-32 pt-16 border-t border-border flex flex-col md:flex-row justify-between items-center gap-12">
            <p className="font-black text-sm text-foreground uppercase tracking-widest m-0">Share the workshop insight.</p>
            <div className="flex gap-4">
              {["FB", "TW", "IN"].map(s => (
                <button key={s} className="h-14 w-14 rounded-full border border-border flex items-center justify-center text-[11px] font-black tracking-widest hover:bg-foreground hover:text-background transition-all">
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* ── NEXT ARTICLE ── */}
      <div className="px-6 md:px-12 lg:px-16 pb-32 flex justify-center">
        <Link href="/news" className="inline-flex items-center gap-2 font-black text-sm text-foreground uppercase tracking-widest hover:translate-x-2 transition-transform">
          Back to News <ArrowUpRight size={18} />
        </Link>
      </div>
    </div>
  );
}
