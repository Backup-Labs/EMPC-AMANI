"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Badge } from "@/components/ui/Badge";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { CTASection } from "@/components/ui/CTASection";

const featuredProjects = [
  { title: "Siam Teak Table", tags: ["Hardwood", "Dining"], image: "/images/hero.png", span: "md:col-span-2 md:row-span-2" },
  { title: "Nordic Lounge Chair", tags: ["Oak", "Minimalist"], image: "/images/project1.png", span: "md:col-span-1 md:row-span-1" },
  { title: "Industrial Bookshelf", tags: ["Steel", "Pine"], image: "/images/project2.png", span: "md:col-span-1 md:row-span-2" },
  { title: "Artisan Credenza", tags: ["Walnut", "Mid-Century"], image: "/images/hero.png", span: "md:col-span-1 md:row-span-1" },
  { title: "Floating Bed Frame", tags: ["Maple", "Modern"], image: "/images/project1.png", span: "md:col-span-2 md:row-span-1" },
  { title: "Minimalist Desk", tags: ["Ash", "Office"], image: "/images/project2.png", span: "md:col-span-1 md:row-span-1" },
  { title: "Legacy Wardrobe", tags: ["Teak", "Bedroom"], image: "/images/hero.png", span: "md:col-span-1 md:row-span-2" },
  { title: "Zen Coffee Table", tags: ["Bamboo", "Living"], image: "/images/project1.png", span: "md:col-span-1 md:row-span-1" },
  { title: "Brutalist Bench", tags: ["Concrete", "Wood"], image: "/images/project2.png", span: "md:col-span-1 md:row-span-1" },
  { title: "Sculptural Stool", tags: ["Ebony", "Art"], image: "/images/hero.png", span: "md:col-span-2 md:row-span-1" },
];

export default function Gallery() {
  return (
    <div className="bg-background min-h-screen overflow-x-hidden text-foreground">
      <PageHero
        image="/images/hero.png"
        alt="Gallery"
        title="Gallery."
        subtitle="A curated collection of bespoke furniture and masterfully crafted woodwork."
      />

      <section className="px-6 md:px-12 lg:px-16 py-8 lg:py-12">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            label="Catalogue"
            heading={<>Crafted for Eternity.<br />Designed for Life.</>}
            desc="Explore our finest pieces, where each grain tells a story of patience and precision."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5 pt-8 auto-rows-[260px]">
            {featuredProjects.map((p, i) => (
              <RevealOnScroll key={i} delay={i * 0.04} className={p.span}>
                <Link href="/products" className="block h-full no-underline text-foreground">
                  <article className={`relative rounded-xl overflow-hidden card-elevated group h-full cursor-pointer`}>
                    <Image src={p.image} alt={p.title} fill sizes="33vw" className="object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                    <div className="absolute bottom-5 left-5 right-5 z-20">
                      <div className="flex gap-1.5 mb-2">
                        {p.tags.map((t) => (
                          <Badge key={t} variant="glass">{t}</Badge>
                        ))}
                      </div>
                      <div className="flex justify-between items-end">
                        <p className="font-black text-lg text-white leading-tight m-0">{p.title}</p>
                        <div className="h-8 w-8 rounded-full bg-white text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <ArrowUpRight size={14} />
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Begin your design journey today."
        buttonText="Contact Studio"
        buttonHref="/contact"
      />
    </div>
  );
}
