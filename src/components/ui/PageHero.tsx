"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface PageHeroProps {
  image: string;
  alt: string;
  title: React.ReactNode;
  subtitle?: string;
  height?: "full" | "tall" | "medium";
  children?: React.ReactNode;
}

export function PageHero({ image, alt, title, subtitle, height = "tall", children }: PageHeroProps) {
  const heightClass = {
    full: "h-screen min-h-[600px]",
    tall: "h-[55vh] min-h-[420px]",
    medium: "h-[45vh] min-h-[360px]",
  }[height];

  return (
    <section className={cn("relative overflow-hidden", heightClass)}>
      <Image src={image} alt={alt} fill priority sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/20 to-black/50" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,0,0,0.08)_0%,transparent_60%)]" />

      <div className="absolute inset-x-0 bottom-0 pb-12 lg:pb-16 px-6 md:px-12 lg:px-16 container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <h1 className="font-black text-[2.6rem] md:text-[3.8rem] lg:text-[5.5rem] leading-[0.88] tracking-[-0.04em] text-white m-0">
              {title}
            </h1>
            {subtitle && (
              <p className="text-white/80 text-base md:text-lg leading-relaxed mt-5 max-w-md m-0">{subtitle}</p>
            )}
          </motion.div>
          {children}
        </div>
      </div>
    </section>
  );
}
