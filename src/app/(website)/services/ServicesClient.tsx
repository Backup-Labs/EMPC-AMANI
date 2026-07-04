"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Counter } from "@/components/AnimatedComponents";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { CTASection } from "@/components/ui/CTASection";
import type { ServiceItem } from "@/lib/cms/settings";

export function ServicesClient({
  services,
  intro,
}: {
  services: ServiceItem[];
  intro?: string;
}) {
  return (
    <div className="bg-background min-h-screen overflow-x-hidden text-foreground">
      <PageHero
        image="/images/project2.png"
        alt="Our Services"
        title="Expertise."
        subtitle={intro || "Master-grade carpentry and vocational training services tailored for excellence."}
      />

      <section className="px-6 md:px-12 lg:px-16 pb-12">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            label="Expertise"
            heading={<>Tailored Care.<br />Inspired Living.</>}
            desc="Discover our modular approach to furniture crafting that turns concepts into masterpieces."
          />

          <div className="flex flex-col">
            {services.length === 0 ? (
              <p className="text-sm text-foreground/50 text-center py-12">No services configured yet.</p>
            ) : services.map((s, i) => (
              <RevealOnScroll key={s.num} delay={i * 0.06}>
                <div className="py-10 lg:py-14 border-b border-border group">
                  <div className="grid grid-cols-1 lg:grid-cols-[100px_1fr_1fr] gap-8 lg:gap-12 items-start">
                    <span className="font-black text-lg text-foreground/20 group-hover:text-foreground transition-colors tracking-widest">{s.num}</span>
                    <div className="flex flex-col gap-6">
                      <div>
                        <h3 className="font-black text-[1.6rem] md:text-[2.2rem] leading-[0.92] tracking-[-0.04em] text-foreground m-0 mb-3 group-hover:translate-x-1 transition-transform duration-500">
                          {s.title}
                        </h3>
                        <p className="text-foreground/60 text-base leading-relaxed m-0 max-w-lg">{s.desc}</p>
                      </div>
                      <div className="flex gap-10 items-center">
                        <div>
                          <p className="font-black text-[2rem] md:text-[2.5rem] tracking-[-0.04em] text-foreground m-0 leading-none">
                            <Counter value={s.stat} suffix={s.suffix} />
                          </p>
                          <p className="text-[10px] font-bold text-foreground/40 tracking-widest uppercase mt-2">{s.statLabel}</p>
                        </div>
                        <Link href="/contact" className="h-12 w-12 rounded-full flex items-center justify-center border border-primary/20 bg-muted hover:bg-primary hover:text-background transition-all text-primary">
                          <ArrowUpRight size={20} />
                        </Link>
                      </div>
                    </div>
                    <div className="relative rounded-xl overflow-hidden aspect-[4/3] card-elevated">
                      <Image src={s.image} alt={s.title} fill sizes="33vw" className="object-cover group-hover:scale-105 transition-transform duration-700" />
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <CTASection title="Begin your design journey today." buttonText="Contact Studio" buttonHref="/contact" />
    </div>
  );
}
