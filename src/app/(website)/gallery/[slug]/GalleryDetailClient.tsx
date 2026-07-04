"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import type { GalleryItem } from "@/components/ui/GalleryLightbox";

export function GalleryDetailClient({ item }: { item: GalleryItem }) {
  const category = item.category || item.tags[0] || "Showcase";

  return (
    <div className="bg-background min-h-screen text-foreground transition-colors duration-300">
      <section className="relative h-[70vh] min-h-100 overflow-hidden">
        <Image src={item.image} alt={item.title} fill sizes="100vw" priority className="object-cover" />
        <div className="absolute inset-0 bg-linear-to-b from-black/30 to-black/70" />
        <div className="absolute inset-x-0 bottom-0 px-6 md:px-12 lg:px-16 pb-12 lg:pb-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block px-4 py-1.5 rounded-full border border-white/40 text-white text-[11px] font-bold tracking-widest uppercase backdrop-blur-md mb-6">
              {category}
            </span>
            <h1 className="font-extrabold text-[2.5rem] md:text-[4rem] lg:text-[5rem] leading-[0.95] tracking-[-0.04em] text-white m-0">
              {item.title}
            </h1>
          </motion.div>
        </div>
      </section>

      {item.description && (
        <section className="px-6 md:px-12 lg:px-16 py-16 lg:py-24">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-bold text-[1.8rem] md:text-[2.2rem] leading-tight tracking-tight m-0 mb-6">About this project</h2>
            <p className="text-foreground/75 text-base md:text-lg leading-relaxed m-0">{item.description}</p>
          </div>
        </section>
      )}

      <section className="px-6 md:px-12 lg:px-16 pb-20 lg:pb-32">
        <div className="max-w-7xl mx-auto border-t border-border pt-10 flex flex-col sm:flex-row justify-between items-center gap-6">
          <Link href="/gallery" className="inline-flex items-center gap-2 font-bold text-sm md:text-base text-foreground hover:underline underline-offset-8 decoration-2 order-2 sm:order-1">
            <ArrowLeft size={18} /> Back to Gallery
          </Link>
          <Link href="/contact" className="inline-flex items-center gap-2 font-bold text-sm md:text-base text-foreground hover:underline underline-offset-8 decoration-2 order-1 sm:order-2">
            Start a Project <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
