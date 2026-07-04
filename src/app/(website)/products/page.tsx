"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Star } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { CTASection } from "@/components/ui/CTASection";
import { products, formatPrice } from "@/lib/data/products";

const categories = ["All", ...Array.from(new Set(products.map((p) => p.category)))];

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All" ? products : products.filter((p) => p.category === activeCategory);

  return (
    <div className="bg-background min-h-screen overflow-x-hidden text-foreground">
      <PageHero
        image="/images/hero.png"
        alt="Products"
        title={<>Crafted<br />Collections.</>}
        subtitle="Explore our curated range of bespoke furniture — each piece hand-built in our Kigali workshop."
      />

      <section className="px-6 md:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            label="Catalog"
            heading={<>Precision Built.<br />Built to Last.</>}
            desc="From dining tables to bedroom suites, every piece reflects decades of woodworking mastery."
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
                    : "bg-muted text-foreground/60 hover:text-foreground hover:bg-muted/80"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Product grid */}
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 py-10"
          >
            {filtered.map((product, i) => (
              <RevealOnScroll key={product.id} delay={i * 0.06}>
                <Link href={`/products/${product.id}`} className="group block no-underline text-foreground">
                  <article className="card-elevated overflow-hidden">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={product.image_url}
                        alt={product.title}
                        fill
                        sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute top-3 left-3 flex gap-1.5">
                        <Badge variant="glass">{product.category}</Badge>
                      </div>
                      {!product.inStock && (
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-foreground/80 text-background">Sold Out</Badge>
                        </div>
                      )}
                    </div>
                    <div className="p-5 flex flex-col gap-3">
                      <div className="flex flex-wrap gap-1.5">
                        {product.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="text-[9px] font-bold uppercase tracking-widest text-foreground/40">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h3 className="font-black text-lg leading-tight tracking-tight m-0 group-hover:text-primary transition-colors">
                        {product.title}
                      </h3>
                      <div className="flex items-center justify-between pt-1">
                        <p className="font-black text-primary text-base m-0">{formatPrice(product.price)}</p>
                        {product.rating && (
                          <div className="flex items-center gap-1">
                            <Star size={12} className="star-filled fill-current" />
                            <span className="text-xs font-bold text-foreground/60">{product.rating}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex justify-end">
                        <div className="h-9 w-9 rounded-full border border-primary/20 flex items-center justify-center transition-all group-hover:bg-primary group-hover:text-background text-primary">
                          <ArrowUpRight size={16} />
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              </RevealOnScroll>
            ))}
          </motion.div>
        </div>
      </section>

      <CTASection
        title={<>Custom piece<br />in mind?</>}
        description="We design and build bespoke furniture tailored to your space, style, and specifications."
        buttonText="Request a Quote"
        buttonHref="/contact"
      />
    </div>
  );
}
