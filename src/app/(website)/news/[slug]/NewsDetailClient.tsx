"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, Clock, Link2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import type { CmsNewsPost } from "@/lib/cms/news";
import { EASE } from "@/lib/motion";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import type { NewsContentBlock } from "@/types";

function TableOfContents({ headings }: { headings: { id: string; text: string }[] }) {
  const { t } = useTranslation();
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-80px 0px -70% 0px" }
    );
    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 2) return null;

  return (
    <nav className="toc-sticky hidden xl:block">
      <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 mb-4">{t("common.onThisPage")}</p>
      <ul className="flex flex-col gap-2">
        {headings.map(({ id, text }) => (
          <li key={id}>
            <a href={`#${id}`} className={`text-sm font-medium no-underline transition-colors block py-1 border-l-2 pl-3 ${activeId === id ? "border-primary text-primary" : "border-transparent text-foreground/40 hover:text-foreground"}`}>{text}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function ContentBlock({ block, index }: { block: NewsContentBlock; index: number }) {
  if (block.type === "html") {
    return (
      <div
        className="prose-article text-foreground/65 text-[1.0625rem] leading-[1.75] mb-5"
        dangerouslySetInnerHTML={{ __html: block.html }}
      />
    );
  }
  if (block.type === "h2") {
    const id = `heading-${index}`;
    return <h2 id={id} className="font-black text-[1.75rem] md:text-[2.2rem] tracking-[-0.04em] leading-tight mt-10 mb-4 text-foreground scroll-mt-32">{block.text}</h2>;
  }
  if (block.type === "h3") {
    const id = `heading-${index}`;
    return <h3 id={id} className="font-black text-xl tracking-tight mt-8 mb-3 text-foreground scroll-mt-32">{block.text}</h3>;
  }
  if (block.type === "image") {
    return (
      <RevealOnScroll>
        <div className="relative rounded-xl overflow-hidden aspect-video my-8 shadow-md">
          <Image src={block.src} alt={block.alt || "Article image"} fill sizes="(max-width:768px) 100vw, 700px" className="object-cover" />
        </div>
      </RevealOnScroll>
    );
  }
  return <p className="text-foreground/65 text-[1.0625rem] leading-[1.75] mb-5">{block.text}</p>;
}

export function NewsDetailClient({ post, related }: { post: CmsNewsPost; related: CmsNewsPost[] }) {
  const { t } = useTranslation();

  const headings = post.content
    .map((block, i) => (block.type === "h2" || block.type === "h3" ? { id: `heading-${i}`, text: block.text } : null))
    .filter(Boolean) as { id: string; text: string }[];

  const handleShare = (platform: string) => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const links: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      copy: url,
    };
    if (platform === "copy") navigator.clipboard?.writeText(url);
    else window.open(links[platform], "_blank", "noopener,noreferrer");
  };

  return (
    <div className="bg-background min-h-screen overflow-x-hidden text-foreground">
      <section className="pt-28 md:pt-32 pb-8 px-6 md:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE }} className="max-w-3xl mx-auto text-center">
            <Link href="/news" className="inline-flex items-center gap-2 font-bold text-[11px] text-foreground/40 uppercase tracking-widest mb-8 hover:text-foreground transition-colors group">
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />{t("common.backToNews")}
            </Link>
            <div className="flex flex-wrap justify-center gap-3 items-center mb-6">
              <Badge>{post.category}</Badge>
              <span className="text-[11px] font-bold text-foreground/40 uppercase tracking-widest">{post.date}</span>
              {post.readTime && <span className="flex items-center gap-1 text-[11px] font-bold text-foreground/40"><Clock size={11} /> {post.readTime}</span>}
            </div>
            <h1 className="font-black text-[2.2rem] md:text-[3.2rem] lg:text-[3.8rem] leading-[0.92] tracking-[-0.04em] m-0">{post.title}</h1>
            <div className="flex items-center justify-center gap-3 mt-8">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-sm text-primary">{post.author[0]}</div>
              <div className="text-left">
                <p className="font-bold text-sm m-0">{post.author}</p>
                <p className="text-[10px] text-foreground/40 m-0 uppercase tracking-widest">{t("common.author")}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      <section className="px-6 md:px-12 lg:px-16 mb-10">
        <div className="max-w-5xl mx-auto">
          <RevealOnScroll>
            <div className="relative rounded-2xl overflow-hidden aspect-[21/9] shadow-lg">
              <Image src={post.image} alt={post.title} fill sizes="100vw" priority className="object-cover" />
            </div>
          </RevealOnScroll>
        </div>
      </section>
      <section className="px-6 md:px-12 lg:px-16 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 xl:grid-cols-[200px_1fr_200px] gap-8 xl:gap-12">
            <div className="hidden xl:block"><TableOfContents headings={headings} /></div>
            <article className="max-w-2xl mx-auto xl:mx-0 prose-article">
              {post.content.map((block, i) => <ContentBlock key={i} block={block} index={i} />)}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-border">
                  {post.tags.map((tag) => <Badge key={tag} className="bg-foreground/5 text-foreground/50">{tag}</Badge>)}
                </div>
              )}
              <div className="mt-10 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <p className="font-bold text-sm text-foreground/60 m-0">{t("common.shareArticle")}</p>
                <div className="flex gap-2">
                  {[{ label: "X", key: "twitter" }, { label: "FB", key: "facebook" }, { label: "Link", key: "copy" }].map(({ label, key }) => (
                    <button key={key} onClick={() => handleShare(key)} className="h-10 px-4 rounded-full border border-border flex items-center justify-center text-[11px] font-black tracking-widest hover:bg-primary hover:text-background hover:border-primary transition-all" aria-label={`Share on ${label}`}>
                      {key === "copy" ? <Link2 size={14} /> : label}
                    </button>
                  ))}
                </div>
              </div>
            </article>
            <div className="hidden xl:block" />
          </div>
        </div>
      </section>
      {related.length > 0 && (
        <section className="px-6 md:px-12 lg:px-16 py-12 bg-muted/50">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-black text-2xl tracking-tight mb-8">{t("common.relatedArticles")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {related.map((item, i) => (
                <RevealOnScroll key={item.slug} delay={i * 0.08}>
                  <Link href={item.externalUrl || `/news/${item.slug}`} className="group block no-underline text-foreground">
                    <article className="card-elevated overflow-hidden flex flex-col sm:flex-row">
                      <div className="relative sm:w-48 aspect-[16/10] sm:aspect-auto shrink-0 overflow-hidden">
                        <Image src={item.image} alt={item.title} fill sizes="200px" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                      </div>
                      <div className="p-5 flex flex-col gap-2 justify-center">
                        <Badge className="w-fit">{item.category}</Badge>
                        <h3 className="font-black text-lg leading-tight m-0 group-hover:text-primary transition-colors">{item.title}</h3>
                        <p className="text-sm text-foreground/50 m-0 line-clamp-2">{item.excerpt}</p>
                      </div>
                    </article>
                  </Link>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>
      )}
      <div className="px-6 md:px-12 lg:px-16 py-10 flex justify-center">
        <Link href="/news" className="inline-flex items-center gap-2 font-bold text-sm text-foreground uppercase tracking-widest hover:text-primary transition-colors group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />{t("common.allArticles")}<ArrowUpRight size={16} />
        </Link>
      </div>
    </div>
  );
}
