"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { useParams } from "next/navigation";

// Mock data for blog details
const blogData: Record<string, any> = {
  "future-of-sustainable-design": {
    title: "Future of Sustainable Design",
    date: "20.03.26",
    author: "Amani",
    category: "Eco Design",
    image: "/images/hero.png",
    content: [
      { type: "p", text: "As we step into a more environmentally conscious era, the field of interior design is undergoing a profound transformation. Sustainability is no longer a niche choice; it is now the foundation of modern luxury." },
      { type: "h2", text: "Material Innovation" },
      { type: "p", text: "From mycelium-grown lampshades to recycled ocean plastic furniture, the materials we bring into our homes are becoming cleaner and more revolutionary. The aesthetic focus has shifted from high-gloss synthetics to raw, organic textures that age beautifully over time." },
      { type: "image", src: "/images/project1.png" },
      { type: "p", text: "Biophilic design specifically has gained immense traction—integrating living greenery, natural light, and organic forms to create spaces that heal as much as they house. The goal is to create a seamless connection between the indoors and the natural world outside." }
    ]
  },
  "minimalism-vs-maximalism": {
    title: "Minimalism vs. Maximalism",
    date: "15.03.26",
    author: "Elena",
    category: "Trends",
    image: "/images/project1.png",
    content: [
      { type: "p", text: "The perennial debate between the 'less is more' and 'more is more' philosophies continues to evolve. In 2026, we see a middle ground emerging—one that values intentionality over volume." },
      { type: "h2", text: "Curated Intentionality" },
      { type: "p", text: "Modern minimalism isn't just about empty rooms; it's about only keeping what serves a purpose or brings joy. Conversely, 2026 maximalism is about rich storytelling through curated collections, not clutter." }
    ]
  },
  "color-psychology": {
    title: "Color Psychology",
    date: "10.03.26",
    author: "Marco",
    category: "Psychology",
    image: "/images/project2.png",
    content: [
      { type: "p", text: "The impact of color and light on human emotion is well-documented, yet often overlooked in residential design." },
      { type: "h2", text: "Reactive Palettes" },
      { type: "p", text: "In 2026, we are seeing a shift towards reactive environments that adapt to the user's emotional state, using subtle hues and dimmable lighting to foster peace and productivity." }
    ]
  }
};

export default function BlogDetail() {
  const params = useParams();
  const slug = params?.slug as string;
  const blog = blogData[slug] || blogData["future-of-sustainable-design"];

  return (
    <div className="bg-white min-h-screen overflow-x-hidden relative text-[#111]">
      {/* ── HEADER ── */}
      <section className="pt-32 md:pt-40 lg:pt-48 pb-12 lg:pb-20 px-6 md:px-12 lg:px-16 container mx-auto max-w-7xl">
        <div className="flex flex-col items-center text-center">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" as any }}>
            <Link href="/blog" className="inline-flex items-center gap-2 font-black text-[11px] text-[#aaa] uppercase tracking-widest mb-12 hover:text-[#111] transition-colors group">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Journal
            </Link>
            
            <div className="flex flex-wrap justify-center gap-8 items-center mb-8">
              <span className="text-black text-[11px] font-black flex items-center gap-2 uppercase tracking-[0.2em]">
                {blog.date}
              </span>
              <div className="h-1 w-1 rounded-full bg-black/10" />
              <span className="text-[#aaa] text-[11px] font-black flex items-center gap-2 uppercase tracking-[0.2em]">
                {blog.author}
              </span>
              <div className="h-1 w-1 rounded-full bg-black/10" />
              <span className="glass px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase text-[#111]">
                {blog.category}
              </span>
            </div>

            <h1 className="font-black text-[2.8rem] md:text-[4.5rem] lg:text-[5.5rem] leading-[0.9] tracking-[-0.05em] text-[#111] m-0 max-w-4xl mx-auto">
              {blog.title}
            </h1>
          </motion.div>
        </div>
      </section>

      {/* ── HERO IMAGE ── */}
      <section className="px-6 md:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="relative rounded-[48px] overflow-hidden aspect-[16/9] lg:aspect-[21/9] shadow-3xl grayscale">
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
                <h2 key={i} className="font-black text-[2rem] md:text-[2.8rem] tracking-[-0.05em] leading-[1] m-0 mt-12 text-[#111]">
                  {item.text}
                </h2>
              );
              if (item.type === "p") return (
                <p key={i} className="text-[#555] text-lg md:text-xl leading-relaxed m-0 text-balance">
                  {item.text}
                </p>
              );
              if (item.type === "image") return (
                <div key={i} className="relative rounded-[40px] overflow-hidden aspect-[16/10] my-12 shadow-3xl grayscale">
                  <Image src={item.src} alt="Article Detail" fill sizes="(max-width:768px) 100vw, 800px" className="object-cover" />
                </div>
              );
              return null;
            })}
          </div>

          {/* Social Share / Footer */}
          <div className="mt-32 pt-16 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-12">
            <p className="font-black text-sm text-[#111] uppercase tracking-widest m-0">Share the design insight.</p>
            <div className="flex gap-4">
              {["FB", "TW", "IN"].map(s => (
                <button key={s} className="h-14 w-14 rounded-full border border-black/5 flex items-center justify-center text-[11px] font-black tracking-widest hover:bg-black hover:text-white transition-all">
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* ── NEXT ARTICLE ── */}
      <div className="px-6 md:px-12 lg:px-16 pb-32 flex justify-center">
        <Link href="/blog" className="inline-flex items-center gap-2 font-black text-sm text-[#111] uppercase tracking-widest hover:translate-x-2 transition-transform">
          Back to Journal <ArrowUpRight size={18} />
        </Link>
      </div>
    </div>
  );
}
