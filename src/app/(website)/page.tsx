"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Counter, LogoMarquee } from "@/components/AnimatedComponents";
import { Testimonials } from "@/components/Testimonials";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { newsPosts } from "@/lib/data/news";
import { products, formatPrice } from "@/lib/data/products";
import { EASE } from "@/lib/motion";

const exclusiveProjects = [
  { title: "Siam Teak Table", category: "Dining", year: "2024", image: "/images/hero.png" },
  { title: "Artisan Credenza", category: "Storage", year: "2025", image: "/images/project1.png" },
  { title: "Nordic Lounge", category: "Seating", year: "2024", image: "/images/project2.png" },
];

const featuredProjects = [
  { title: "Master Suite Set", tags: ["Oak", "Bespoke"], image: "/images/hero.png" },
  { title: "Floating Bed Frame", tags: ["Maple", "Modern"], image: "/images/project1.png" },
  { title: "Live Edge Desk", tags: ["Walnut", "Office"], image: "/images/project2.png" },
];

const partners = [
  { name: "RTB", icon: "R" },
  { name: "WoodMaster", icon: "W" },
  { name: "EcoTimber", icon: "E" },
  { name: "Vocation", icon: "V" },
  { name: "Heritage", icon: "H" },
  { name: "CraftHub", icon: "C" },
];

const latestNews = newsPosts.slice(0, 3);
const featuredProducts = products.slice(0, 3);

export default function Home() {
  const [carouselIdx, setCarouselIdx] = useState(0);
  const prevSlide = () => setCarouselIdx((i) => (i - 1 + exclusiveProjects.length) % exclusiveProjects.length);
  const nextSlide = () => setCarouselIdx((i) => (i + 1) % exclusiveProjects.length);
  const slide = exclusiveProjects[carouselIdx];

  return (
    <div className="bg-background min-h-screen overflow-x-hidden relative text-foreground">

      {/* Hero */}
      <section className="relative h-screen min-h-[600px] overflow-hidden">
        <Image src="/images/hero.png" alt="EMPC-AMANI Interior" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-linear-to-b from-black/60 via-transparent to-black/40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,0,0,0.05)_0%,transparent_60%)]" />

        <div className="absolute inset-x-0 bottom-0 pb-12 lg:pb-16 px-6 md:px-12 lg:px-16 container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
            <div className="max-w-3xl">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: EASE }}
                className="font-black text-[2.8rem] md:text-[4rem] lg:text-[5.5rem] leading-[0.88] tracking-[-0.04em] text-white m-0"
              >
                Masterful<br />
                <span className="text-white bg-clip-text bg-linear-to-r from-accent-cyan via-accent-coral to-accent-pink">
                  Carpentry.
                </span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
                className="text-white/80 text-base md:text-lg leading-relaxed mt-5 max-w-lg"
              >
                Precision in wood, excellence in craft. We create bespoke furniture
                while empowering the next generation of master artisans.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.25, ease: EASE }}
                className="flex flex-wrap gap-3 mt-6"
              >
                <Button href="/products" size="lg">Explore Products</Button>
                <Button href="/contact" variant="outline" size="lg" className="border-white/30 text-white hover:bg-white hover:text-foreground">
                  Get a Quote
                </Button>
              </motion.div>
            </div>

            <Link href="/gallery" className="shrink-0 transition-all hover:scale-105 active:scale-95 group relative z-10">
              <div className="glass rounded-2xl overflow-hidden w-52 md:w-60 p-2.5 shadow-2xl">
                <div className="relative h-36 rounded-xl overflow-hidden">
                  <Image src="/images/project1.png" alt="Workshop Excellence" fill sizes="240px" className="object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
                <div className="pt-3 px-2 pb-1 flex justify-between items-center">
                  <span className="font-bold text-[13px] text-foreground">Workshop Excellence</span>
                  <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center text-background">
                    <ArrowUpRight size={14} />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Studio */}
      <section className="px-6 md:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            label="Workshop"
            heading={<>Raw Material.<br />Masterful Detail.</>}
            desc="Our carpentry workshop is where traditional techniques meet modern precision to create furniture that lasts generations."
            rightEl={
              <Link href="/about" className="inline-flex items-center gap-2 group font-bold text-sm text-primary">
                Learn our story <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            }
          />
        </div>
      </section>

      {/* Image + Stats */}
      <section className="px-6 md:px-12 lg:px-16 py-8 lg:py-12">
        <div className="max-w-7xl mx-auto">
          <RevealOnScroll>
            <div className="relative rounded-2xl overflow-hidden aspect-[21/9] mb-8 lg:mb-10 shadow-lg">
              <Image src="/images/project2.png" alt="Studio" fill sizes="100vw" className="object-cover" />
            </div>
          </RevealOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
            {[
              { val: 2500, suffix: "+", label: "Bespoke Pieces", desc: "Hand-crafted furniture delivered to homes and offices since 2012." },
              { val: 85, label: "Master Artisans", desc: "Trained through our workshop and now leading the industry." },
              { val: "RTB", label: "Certified Excellence", desc: "Official partner in vocational training and professional certification." },
            ].map((s, i) => (
              <RevealOnScroll key={i} delay={i * 0.08}>
                <div className="card-elevated p-6 flex flex-col">
                  <p className="font-black text-[2.8rem] lg:text-[3.2rem] tracking-[-0.04em] text-primary m-0 leading-none">
                    <Counter value={s.val} suffix={s.suffix} />
                  </p>
                  <p className="font-black text-base text-foreground mt-4 mb-2 uppercase tracking-tight">{s.label}</p>
                  <p className="text-sm text-foreground/60 leading-relaxed m-0">{s.desc}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Products showcase */}
      <section className="px-6 md:px-12 lg:px-16 py-8 lg:py-12 bg-muted/50">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            label="Products"
            heading={<>Crafted for<br />Every Space.</>}
            desc="Browse our collection of hand-built furniture — each piece a testament to woodworking mastery."
            rightEl={
              <Link href="/products" className="inline-flex items-center gap-2 group font-bold text-sm text-primary">
                View all products <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            }
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 py-8">
            {featuredProducts.map((product, i) => (
              <RevealOnScroll key={product.id} delay={i * 0.08}>
                <Link href={`/products/${product.id}`} className="group block no-underline text-foreground">
                  <article className="card-elevated overflow-hidden">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image src={product.image_url} alt={product.title} fill sizes="33vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute top-3 left-3"><Badge variant="glass">{product.category}</Badge></div>
                    </div>
                    <div className="p-4 flex flex-col gap-2">
                      <h3 className="font-black text-base m-0 group-hover:text-primary transition-colors">{product.title}</h3>
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-primary text-sm m-0">{formatPrice(product.price)}</p>
                        {product.rating && (
                          <div className="flex items-center gap-1">
                            <Star size={11} className="star-filled fill-current" />
                            <span className="text-xs font-bold text-foreground/50">{product.rating}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                </Link>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Exclusive carousel */}
      <section className="px-6 md:px-12 lg:px-16 bg-muted relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <SectionHeader
            label="Exclusive"
            heading={<>Boldly Rooted.<br />Flawlessly Executed.</>}
            desc="A curated selection of our most ambitious architectural interventions and luxury residential projects."
          />

          <div className="py-8">
            <div className="flex gap-3 justify-end mb-5">
              <button onClick={prevSlide} className="h-11 w-11 rounded-full glass flex items-center justify-center hover:bg-primary hover:text-background transition-all active:scale-95 text-foreground" aria-label="Previous">
                <ChevronLeft size={20} />
              </button>
              <button onClick={nextSlide} className="h-11 w-11 rounded-full glass flex items-center justify-center hover:bg-primary hover:text-background transition-all active:scale-95 text-foreground" aria-label="Next">
                <ChevronRight size={20} />
              </button>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={carouselIdx}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="relative rounded-2xl overflow-hidden aspect-[21/9] shadow-lg"
              >
                <Image src={slide.image} alt={slide.title} fill sizes="100vw" className="object-cover" />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-transparent" />
                <div className="absolute bottom-8 left-8">
                  <p className="font-black text-[1.6rem] md:text-[2.2rem] text-white m-0 tracking-[-0.04em]">{slide.title}</p>
                  <Link href="/gallery" className="mt-4 inline-flex h-10 items-center px-6 rounded-full glass text-xs font-bold text-white hover:bg-white hover:text-black transition-all">
                    Exploration <ArrowUpRight size={14} className="ml-1.5" />
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Featured projects */}
      <section className="px-6 md:px-12 lg:px-16 py-8 lg:py-12">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            label="Gallery"
            heading={<>Inspiring Spaces.<br />Resonant Experience.</>}
            desc="Our diverse range of work spans from boutique retail to high-end hospitality."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6 py-8">
            {featuredProjects.map((p, i) => (
              <RevealOnScroll key={i} delay={i * 0.08}>
                <Link href="/gallery" className="group block no-underline text-foreground">
                  <article className="card-elevated p-4 flex flex-col gap-4">
                    <div className="relative rounded-xl overflow-hidden aspect-square">
                      <Image src={p.image} alt={p.title} fill sizes="33vw" className="object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute top-3 left-3 flex gap-1.5">
                        {p.tags.map((t) => (
                          <Badge key={t} variant="glass">{t}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="font-black text-lg text-foreground m-0">{p.title}</p>
                      <div className="h-9 w-9 rounded-full border border-primary/20 flex items-center justify-center group-hover:bg-primary group-hover:text-background text-primary transition-all">
                        <ArrowUpRight size={16} />
                      </div>
                    </div>
                  </article>
                </Link>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="px-6 md:px-12 lg:px-16 py-8 lg:py-12 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-6">
            <div>
              <span className="font-bold text-xs uppercase tracking-widest text-foreground/40">Collaborations</span>
              <h2 className="font-black text-2xl md:text-3xl text-foreground tracking-tight mt-2">Our Trusted Partners.</h2>
            </div>
            <LogoMarquee logos={partners} />
          </div>
        </div>
      </section>

      {/* News strip */}
      <section className="px-6 md:px-12 lg:px-16 py-8 lg:py-12 bg-muted">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end pb-6 border-b border-border">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-primary block" />
                <span className="font-bold text-xs uppercase tracking-widest text-foreground/60">News</span>
              </div>
              <h2 className="font-black text-[2rem] md:text-[2.8rem] text-foreground leading-[0.92] tracking-[-0.04em] m-0">Latest Stories.</h2>
            </div>
            <Link href="/news" className="h-11 w-11 rounded-full glass flex items-center justify-center hover:bg-primary hover:text-background transition-all text-primary">
              <ArrowUpRight size={20} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 py-8">
            {latestNews.map((b, i) => (
              <RevealOnScroll key={b.slug} delay={i * 0.08}>
                <Link href={`/news/${b.slug}`} className="group block no-underline text-foreground">
                  <article className="card-elevated overflow-hidden">
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image src={b.image} alt={b.title} fill sizes="33vw" className="object-cover group-hover:scale-105 transition-transform duration-700" />
                    </div>
                    <div className="p-4">
                      <p className="text-[10px] font-bold text-primary mb-2 uppercase tracking-widest">{b.date}</p>
                      <p className="font-black text-base text-foreground m-0 group-hover:text-primary transition-colors">{b.title}</p>
                    </div>
                  </article>
                </Link>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 md:px-12 lg:px-16 py-8 lg:py-12">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            label="Reviews"
            heading={<>Shared Experiences.<br />Verified Trust.</>}
            desc="What our clients and carpentry training graduates have to say about EMPC."
          />
          <Testimonials />
        </div>
      </section>
    </div>
  );
}
