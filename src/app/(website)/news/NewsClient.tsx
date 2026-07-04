"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Clock, ExternalLink } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Badge } from "@/components/ui/Badge";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { CTASection } from "@/components/ui/CTASection";
import type { CmsNewsPost } from "@/lib/cms/news";
import { EASE } from "@/lib/motion";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

function PostLink({ post, className, children }: { post: CmsNewsPost; className?: string; children: React.ReactNode }) {
  if (post.externalUrl) {
    return (
      <a href={post.externalUrl} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }
  return <Link href={`/news/${post.slug}`} className={className}>{children}</Link>;
}

export function NewsClient({ posts }: { posts: CmsNewsPost[] }) {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState("All");
  const [isLoading] = useState(false);

  const categories = ["All", ...Array.from(new Set(posts.map((p) => p.category)))];
  const filtered = activeCategory === "All" ? posts : posts.filter((p) => p.category === activeCategory);
  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div className="bg-background min-h-screen overflow-x-hidden text-foreground">
      <PageHero image="/images/hero.png" alt="News" title={<>{t("news.heroTitle1")}<br />{t("news.heroTitle2")}</>} subtitle={t("news.heroDesc")} />
      <section className="px-6 md:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <SectionHeader label={t("news.storiesLabel")} heading={<>{t("news.storiesHeading1")}<br />{t("news.storiesHeading2")}</>} desc={t("news.storiesDesc")} />
          <div className="flex flex-wrap gap-2 py-6 border-b border-border">
            {categories.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 ${activeCategory === cat ? "bg-primary text-background shadow-sm" : "bg-muted text-foreground/60 hover:text-foreground"}`}>
                {cat === "All" ? t("common.all") : cat}
              </button>
            ))}
          </div>
          {isLoading ? null : (
            <>
              {featured && (
                <RevealOnScroll>
                  <PostLink post={featured} className="group block no-underline text-foreground py-8">
                    <article className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center">
                      <div className="relative aspect-16/10 rounded-2xl overflow-hidden shadow-lg">
                        <Image src={featured.image} alt={featured.title} fill sizes="(max-width:1024px) 100vw, 50vw" priority className="object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute top-4 left-4 flex gap-2">
                          <Badge variant="glass">{t("common.featured")}</Badge>
                          {featured.externalUrl && <Badge className="bg-indigo-600 text-white">Media</Badge>}
                        </div>
                      </div>
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3 flex-wrap">
                          <Badge>{featured.category}</Badge>
                          <span className="text-[11px] font-bold text-foreground/40 uppercase tracking-widest">{featured.date}</span>
                          {featured.externalSource && <span className="text-[11px] font-bold text-indigo-600">{featured.externalSource}</span>}
                        </div>
                        <h2 className="font-black text-[2rem] md:text-[2.6rem] leading-[0.92] tracking-[-0.04em] m-0 group-hover:text-primary transition-colors">{featured.title}</h2>
                        <p className="text-foreground/60 text-base leading-relaxed m-0 line-clamp-3">{featured.excerpt}</p>
                        <div className="flex items-center gap-3 pt-2">
                          <span className="text-sm font-bold text-foreground/60">{featured.author}</span>
                          <div className="ml-auto h-10 w-10 rounded-full glass flex items-center justify-center group-hover:bg-primary group-hover:text-background transition-all">
                            {featured.externalUrl ? <ExternalLink size={16} /> : <ArrowUpRight size={18} />}
                          </div>
                        </div>
                      </div>
                    </article>
                  </PostLink>
                </RevealOnScroll>
              )}
              <motion.div key={activeCategory} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, ease: EASE }} className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 py-6 border-t border-border">
                {rest.map((post, i) => (
                  <RevealOnScroll key={post.slug} delay={i * 0.08}>
                    <PostLink post={post} className="group block no-underline text-foreground">
                      <article className="card-elevated overflow-hidden h-full flex flex-col">
                        <div className="relative aspect-16/10 overflow-hidden">
                          <Image src={post.image} alt={post.title} fill sizes="(max-width:768px) 100vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                          <div className="absolute top-3 left-3"><Badge variant="glass">{post.category}</Badge></div>
                        </div>
                        <div className="p-5 flex flex-col gap-3 flex-1">
                          <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">{post.date}</span>
                          <h3 className="font-black text-xl leading-tight m-0 group-hover:text-primary transition-colors">{post.title}</h3>
                          <p className="text-foreground/60 text-sm leading-relaxed m-0 line-clamp-2 flex-1">{post.excerpt}</p>
                          <div className="flex items-center justify-between pt-2">
                            <span className="text-xs font-bold text-foreground/50">{post.externalSource || post.author}</span>
                            <div className="h-8 w-8 rounded-full border border-primary/20 flex items-center justify-center group-hover:bg-primary group-hover:text-background transition-all text-primary">
                              {post.externalUrl ? <ExternalLink size={12} /> : <ArrowUpRight size={14} />}
                            </div>
                          </div>
                        </div>
                      </article>
                    </PostLink>
                  </RevealOnScroll>
                ))}
              </motion.div>
            </>
          )}
        </div>
      </section>
      <CTASection title={t("common.stayInLoop")} description={t("common.stayInLoopDesc")}>
        <div className="flex w-full max-w-md gap-3">
          <input type="email" placeholder={t("common.emailPlaceholder")} className="h-12 flex-1 px-5 rounded-full border border-border text-sm font-medium bg-background/50 focus:outline-none focus:border-primary" />
          <button className="h-12 w-12 bg-primary text-background rounded-full flex items-center justify-center hover:opacity-90 shadow-md active:scale-95"><ArrowUpRight size={20} /></button>
        </div>
      </CTASection>
    </div>
  );
}
