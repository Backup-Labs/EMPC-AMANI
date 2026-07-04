"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Clock } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Badge } from "@/components/ui/Badge";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { CTASection } from "@/components/ui/CTASection";
import { newsPosts } from "@/lib/data/news";
import { EASE } from "@/lib/motion";

const categories = ["All", ...Array.from(new Set(newsPosts.map((p) => p.category)))];

export default function NewsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [isLoading] = useState(false);

  const filtered =
    activeCategory === "All" ? newsPosts : newsPosts.filter((p) => p.category === activeCategory);

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div className="bg-background min-h-screen overflow-x-hidden text-foreground">
      <PageHero
        image="/images/hero.png"
        alt="News"
        title={<>Latest<br />Insights.</>}
        subtitle="Discover the latest stories from our workshop, where tradition meets modern innovation."
      />

      <section className="px-6 md:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            label="Stories"
            heading={<>The Workshop<br />Chronicles.</>}
            desc="Insights into our process, our heritage, and the future of artisanal craftsmanship."
          />

          {/* Category filter */}
          <div className="flex flex-wrap gap-2 py-6 border-b border-border">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                  activeCategory === cat
                    ? "bg-primary text-background shadow-sm"
                    : "bg-muted text-foreground/60 hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-10">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col gap-4">
                  <div className="skeleton aspect-[16/10] rounded-xl" />
                  <div className="skeleton h-4 w-1/3 rounded" />
                  <div className="skeleton h-6 w-2/3 rounded" />
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Featured article */}
              {featured && (
                <RevealOnScroll>
                  <Link href={`/news/${featured.slug}`} className="group block no-underline text-foreground py-8">
                    <article className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center">
                      <div className="relative aspect-[16/10] rounded-2xl overflow-hidden shadow-lg">
                        <Image
                          src={featured.image}
                          alt={featured.title}
                          fill
                          sizes="(max-width:1024px) 100vw, 50vw"
                          priority
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute top-4 left-4">
                          <Badge variant="glass">Featured</Badge>
                        </div>
                      </div>
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3 flex-wrap">
                          <Badge>{featured.category}</Badge>
                          <span className="text-[11px] font-bold text-foreground/40 uppercase tracking-widest">
                            {featured.date}
                          </span>
                          {featured.readTime && (
                            <span className="flex items-center gap-1 text-[11px] font-bold text-foreground/40">
                              <Clock size={11} /> {featured.readTime}
                            </span>
                          )}
                        </div>
                        <h2 className="font-black text-[2rem] md:text-[2.6rem] leading-[0.92] tracking-[-0.04em] m-0 group-hover:text-primary transition-colors">
                          {featured.title}
                        </h2>
                        <p className="text-foreground/60 text-base leading-relaxed m-0 line-clamp-3">
                          {featured.excerpt}
                        </p>
                        <div className="flex items-center gap-3 pt-2">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-xs text-primary">
                            {featured.author[0]}
                          </div>
                          <span className="text-sm font-bold text-foreground/60">{featured.author}</span>
                          <div className="ml-auto h-10 w-10 rounded-full glass flex items-center justify-center group-hover:bg-primary group-hover:text-background transition-all">
                            <ArrowUpRight size={18} />
                          </div>
                        </div>
                      </div>
                    </article>
                  </Link>
                </RevealOnScroll>
              )}

              {/* Article grid */}
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 py-6 border-t border-border"
              >
                {rest.map((post, i) => (
                  <RevealOnScroll key={post.slug} delay={i * 0.08}>
                    <Link href={`/news/${post.slug}`} className="group block no-underline text-foreground">
                      <article className="card-elevated overflow-hidden h-full flex flex-col">
                        <div className="relative aspect-[16/10] overflow-hidden">
                          <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            sizes="(max-width:768px) 100vw, 50vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute top-3 left-3">
                            <Badge variant="glass">{post.category}</Badge>
                          </div>
                        </div>
                        <div className="p-5 flex flex-col gap-3 flex-1">
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">
                              {post.date}
                            </span>
                            {post.readTime && (
                              <span className="flex items-center gap-1 text-[10px] font-bold text-foreground/40">
                                <Clock size={10} /> {post.readTime}
                              </span>
                            )}
                          </div>
                          <h3 className="font-black text-xl leading-tight tracking-tight m-0 group-hover:text-primary transition-colors">
                            {post.title}
                          </h3>
                          <p className="text-foreground/60 text-sm leading-relaxed m-0 line-clamp-2 flex-1">
                            {post.excerpt}
                          </p>
                          <div className="flex items-center justify-between pt-2">
                            <span className="text-xs font-bold text-foreground/50">{post.author}</span>
                            <div className="h-8 w-8 rounded-full border border-primary/20 flex items-center justify-center group-hover:bg-primary group-hover:text-background transition-all text-primary">
                              <ArrowUpRight size={14} />
                            </div>
                          </div>
                        </div>
                      </article>
                    </Link>
                  </RevealOnScroll>
                ))}
              </motion.div>
            </>
          )}
        </div>
      </section>

      <CTASection
        title={<>Stay in the loop.</>}
        description="Get workshop updates, design inspiration, and exclusive offers delivered to your inbox."
      >
        <div className="flex w-full max-w-md gap-3">
          <input
            type="email"
            placeholder="Email address"
            className="h-12 flex-1 px-5 rounded-full border border-border text-sm font-medium bg-background/50 focus:outline-none focus:border-primary transition-colors"
          />
          <button className="h-12 w-12 bg-primary text-background rounded-full flex items-center justify-center hover:opacity-90 transition-all shadow-md active:scale-95">
            <ArrowUpRight size={20} />
          </button>
        </div>
      </CTASection>
    </div>
  );
}
