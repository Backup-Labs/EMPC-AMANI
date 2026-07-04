"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ArrowUpRight, Maximize2 } from "lucide-react";
import { motion } from "framer-motion";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Badge } from "@/components/ui/Badge";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { CTASection } from "@/components/ui/CTASection";
import { GalleryLightbox, type GalleryItem } from "@/components/ui/GalleryLightbox";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

export function GalleryClient({ items }: { items: (GalleryItem & { span?: string })[] }) {
  const { t } = useTranslation();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <div className="bg-background min-h-screen overflow-x-hidden text-foreground">
      <PageHero image="/images/hero.png" alt="Gallery" title={t("gallery.heroTitle")} subtitle={t("gallery.heroDesc")} />
      <section className="px-6 md:px-12 lg:px-16 py-8 lg:py-12">
        <div className="max-w-7xl mx-auto">
          <SectionHeader label={t("gallery.catalogueLabel")} heading={<>{t("gallery.catalogueHeading1")}<br />{t("gallery.catalogueHeading2")}</>} desc={t("gallery.catalogueDesc")} />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 lg:gap-4 pt-8 auto-rows-[200px] md:auto-rows-[220px]">
            {items.length === 0 ? (
              <p className="text-sm text-foreground/50 col-span-full text-center py-12">No gallery items published yet.</p>
            ) : items.map((p, i) => (
              <RevealOnScroll key={p.id || i} delay={i * 0.03} className={p.span}>
                <motion.button type="button" onClick={() => setLightboxIndex(i)} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="relative rounded-xl overflow-hidden card-elevated group h-full w-full cursor-pointer text-left" aria-label={`${p.title} — ${t("gallery.viewFullscreen")}`}>
                  <Image src={p.image} alt={p.title} fill sizes="(max-width:768px) 100vw, 25vw" loading={i < 4 ? "eager" : "lazy"} className="object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/20 to-transparent opacity-70 group-hover:opacity-100 transition-opacity duration-400 z-10" />
                  <div className="absolute top-3 right-3 z-20 h-8 w-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100"><Maximize2 size={14} /></div>
                  <div className="absolute bottom-4 left-4 right-4 z-20 translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex gap-1.5 mb-2 flex-wrap">{p.tags.map((tag) => <Badge key={tag} variant="glass">{tag}</Badge>)}</div>
                    <div className="flex justify-between items-end gap-2">
                      <p className="font-black text-base md:text-lg text-white leading-tight m-0">{p.title}</p>
                      <div className="h-7 w-7 rounded-full bg-white text-foreground flex items-center justify-center shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"><ArrowUpRight size={13} /></div>
                    </div>
                  </div>
                </motion.button>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>
      <GalleryLightbox items={items} activeIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} onNavigate={setLightboxIndex} />
      <CTASection title={t("common.beginJourney")} buttonText={t("common.contactStudio")} buttonHref="/contact" />
    </div>
  );
}
