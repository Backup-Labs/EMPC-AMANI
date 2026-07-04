"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Star } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Badge } from "@/components/ui/Badge";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { CTASection } from "@/components/ui/CTASection";
import { formatPrice, productPath } from "@/lib/format";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { EASE } from "@/lib/motion";
import type { Product } from "@/types";

export function ProductsClient({ products }: { products: Product[] }) {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(products.map((p) => p.category)))],
    [products]
  );

  const filtered =
    activeCategory === "All" ? products : products.filter((p) => p.category === activeCategory);

  return (
    <div className="bg-background min-h-screen overflow-x-hidden text-foreground">
      <PageHero
        image="/images/hero.png"
        alt="Products"
        title={<>{t("products.heroTitle1")}<br />{t("products.heroTitle2")}</>}
        subtitle={t("products.heroDesc")}
      />

      <section className="px-6 md:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            label={t("products.catalogLabel")}
            heading={<>{t("products.catalogHeading1")}<br />{t("products.catalogHeading2")}</>}
            desc={t("products.catalogDesc")}
          />

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
                {cat === "All" ? t("common.all") : cat}
              </button>
            ))}
          </div>

          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 py-10"
          >
            {filtered.map((product, i) => (
              <RevealOnScroll key={product.id} delay={i * 0.06}>
                <Link href={`/products/${productPath(product)}`} className="group block no-underline text-foreground">
                  <article className="card-elevated overflow-hidden">
                    <div className="relative aspect-4/3 overflow-hidden">
                      <Image
                        src={product.image_url}
                        alt={product.title}
                        fill
                        sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                        loading={i < 3 ? "eager" : "lazy"}
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute top-3 left-3">
                        <Badge variant="glass">{product.category}</Badge>
                      </div>
                      {product.inStock === false && (
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-foreground/80 text-background">{t("common.soldOut")}</Badge>
                        </div>
                      )}
                    </div>
                    <div className="p-5 flex flex-col gap-3">
                      <h3 className="font-black text-lg leading-tight m-0 group-hover:text-primary transition-colors">
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
        title={<>{t("common.customPiece")}</>}
        description={t("common.customPieceDesc")}
        buttonText={t("common.requestQuote")}
        buttonHref="/contact"
      />
    </div>
  );
}
