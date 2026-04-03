"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, Calendar, User } from "lucide-react";
import { useParams } from "next/navigation";

// Mock data for blog details
const blogData: Record<string, any> = {
  "the-future-of-sustainable-design": {
    title: "The Future of Sustainable Interior Design",
    date: "March 20, 2026",
    author: "Amani",
    category: "Sustainability",
    image: "/images/hero.png",
    content: [
      { type: "p", text: "As we step into a more environmentally conscious era, the field of interior design is undergoing a profound transformation. Sustainability is no longer a niche choice; it is now the foundation of modern luxury." },
      { type: "h2", text: "Material Innovation" },
      { type: "p", text: "From mycelium-grown lampshades to recycled ocean plastic furniture, the materials we bring into our homes are becoming cleaner and more revolutionary. The aesthetic focus has shifted from high-gloss synthetics to raw, organic textures that age beautifully over time." },
      { type: "image", src: "/images/project1.png" },
      { type: "p", text: "Biophilic design specifically has gained immense traction—integrating living greenery, natural light, and organic forms to create spaces that heal as much as they house. The goal is to create a seamless connection between the indoors and the natural world outside." }
    ]
  },
  "minimalism-vs-maximalism-in-2026": {
    title: "Minimalism vs. Maximalism in 2026",
    date: "March 15, 2026",
    author: "Elena",
    category: "Trends",
    image: "/images/project1.png",
    content: [
      { type: "p", text: "The perennial debate between the 'less is more' and 'more is more' philosophies continues to evolve. In 2026, we see a middle ground emerging—one that values intentionality over volume." },
      { type: "h2", text: "Curated Intentionality" },
      { type: "p", text: "Modern minimalism isn't just about empty rooms; it's about only keeping what serves a purpose or brings joy. Conversely, 2026 maximalism is about rich storytelling through curated collections, not clutter." }
    ]
  }
};

export default function BlogDetail() {
  const params = useParams();
  const slug = params?.slug as string;
  const blog = blogData[slug] || blogData["the-future-of-sustainable-design"];

  return (
    <div className="bg-[#f0f0f0] min-h-screen">
      {/* ── HEADER ── */}
      <section className="pt-32 md:pt-40 lg:pt-48 pb-12 lg:pb-20 px-6 md:px-12 lg:px-16">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Link href="/blog" className="inline-flex items-center gap-2 font-bold text-xs md:text-sm text-[#888] mb-8 md:mb-12 hover:text-[#111] transition-colors group">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Blog
            </Link>
            
            <div className="flex flex-wrap justify-center gap-4 md:gap-8 items-center mb-6 md:mb-8">
              <span className="text-[#888] text-[10px] md:text-[11px] font-bold flex items-center gap-2 uppercase tracking-widest">
                <Calendar size={14} /> {blog.date}
              </span>
              <span className="text-[#888] text-[10px] md:text-[11px] font-bold flex items-center gap-2 uppercase tracking-widest">
                <User size={14} /> {blog.author}
              </span>
              <span className="bg-[#ddd] px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase border border-black/5">
                {blog.category}
              </span>
            </div>

            <h1 className="font-extrabold text-[2.5rem] md:text-[3.5rem] lg:text-[4.5rem] leading-[1.05] tracking-[-0.04em] text-[#111] m-0 max-w-[800px]">
              {blog.title}
            </h1>
          </motion.div>
        </div>
      </section>

      {/* ── HERO IMAGE ── */}
      <section className="px-6 md:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="relative rounded-[2rem] md:rounded-[3rem] overflow-hidden aspect-[16/9] lg:aspect-[21/9] shadow-lg">
            <Image src={blog.image} alt={blog.title} fill sizes="100vw" priority className="object-cover" />
          </div>
        </div>
      </section>

      {/* ── CONTENT ── */}
      <section className="px-6 md:px-12 lg:px-16 py-16 lg:py-24">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col gap-8 md:gap-12">
            {blog.content?.map((item: any, i: number) => {
              if (item.type === "h2") return (
                <h2 key={i} className="font-bold text-[1.8rem] md:text-[2.2rem] lg:text-[2.5rem] tracking-tight leading-tight m-0 mt-8 md:mt-12 text-[#111]">
                  {item.text}
                </h2>
              );
              if (item.type === "p") return (
                <p key={i} className="text-[#444] text-base md:text-lg lg:text-[1.15rem] leading-relaxed m-0 text-balance">
                  {item.text}
                </p>
              );
              if (item.type === "image") return (
                <div key={i} className="relative rounded-3xl overflow-hidden aspect-[16/10] my-8 md:my-12 shadow-md">
                  <Image src={item.src} alt="Article Detail" fill sizes="(max-width:768px) 100vw, 800px" className="object-cover" />
                </div>
              );
              return null;
            })}
          </div>

          {/* Social Share / Footer */}
          <div className="mt-20 md:mt-32 pt-10 md:pt-14 border-t border-[#e0e0e0] flex flex-col sm:flex-row justify-between items-center gap-8">
            <p className="font-bold text-sm md:text-base text-[#111] m-0">Found this helpful? Share the design insight.</p>
            <div className="flex gap-3">
              {["FB", "X", "LI"].map(s => (
                <button key={s} className="h-11 w-11 rounded-full border border-[#ccc] flex items-center justify-center text-[11px] font-bold tracking-widest hover:bg-[#111] hover:text-white hover:border-[#111] transition-all transform hover:-translate-y-1">
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* ── BACK BUTTON BOTTOM ── */}
      <div className="px-6 md:px-12 lg:px-16 pb-20 lg:pb-32 flex justify-center">
        <Link href="/blog" className="inline-flex items-center gap-1.5 font-bold text-sm text-[#111] hover:underline underline-offset-8 decoration-2">
          <ArrowLeft size={18} /> Back to Blog Feed
        </Link>
      </div>
    </div>
  );
}
