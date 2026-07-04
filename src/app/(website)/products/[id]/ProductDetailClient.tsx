"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  ShoppingBag,
  Star,
  Truck,
  Shield,
  MessageCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { formatPrice, productPath } from "@/lib/format";
import { trackProductView } from "@/lib/portal/recentlyViewed";
import { EASE } from "@/lib/motion";
import type { Product } from "@/types";

function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={star <= Math.round(rating) ? "star-filled fill-current" : "star-empty"}
        />
      ))}
    </div>
  );
}

export function ProductDetailClient({
  product,
  relatedProducts,
}: {
  product: Product;
  relatedProducts: Product[];
}) {
  const { t } = useTranslation();
  const related = relatedProducts;
  const reviews: { id: string; author: string; rating: number; date: string; comment: string }[] = [];

  useEffect(() => {
    trackProductView({
      id: product.id,
      title: product.title,
      image_url: product.image_url,
      price: product.price,
    });
  }, [product]);

  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"specs" | "features" | "reviews">("specs");

  const totalPrice = useMemo(() => product.price * quantity, [product, quantity]);

  const quoteHref = useMemo(() => {
    const p = new URLSearchParams({
      product: product.title,
      qty: String(quantity),
      total: String(totalPrice),
      type: "custom_order",
    });
    return `/contact?${p.toString()}`;
  }, [product, quantity, totalPrice]);

  const images = product.images || [product.image_url];
  const inStock = product.inStock !== false;

  const trustBadges = [
    { icon: Truck, text: t("common.freeDelivery") },
    { icon: Shield, text: t("common.guarantee") },
    { icon: Check, text: t("common.handCrafted") },
    { icon: MessageCircle, text: t("common.customSizing") },
  ];

  return (
    <div className="bg-background min-h-screen overflow-x-hidden text-foreground">
      <div className="pt-28 pb-4 px-6 md:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <Link href="/products" className="inline-flex items-center gap-2 font-bold text-xs text-foreground/50 uppercase tracking-widest hover:text-foreground transition-colors group">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            {t("common.backToProducts")}
          </Link>
        </div>
      </div>

      <section className="px-6 md:px-12 lg:px-16 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <RevealOnScroll>
              <div className="flex flex-col gap-3">
                <div className="relative aspect-square rounded-2xl overflow-hidden shadow-lg bg-muted">
                  <AnimatePresence mode="wait">
                    <motion.div key={activeImage} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="absolute inset-0">
                      <Image src={images[activeImage]} alt={product.title} fill sizes="(max-width:1024px) 100vw, 50vw" priority className="object-cover" />
                    </motion.div>
                  </AnimatePresence>
                  {images.length > 1 && (
                    <>
                      <button onClick={() => setActiveImage((i) => (i - 1 + images.length) % images.length)} className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full glass-nav flex items-center justify-center hover:bg-primary hover:text-background transition-all text-foreground" aria-label="Previous"><ChevronLeft size={18} /></button>
                      <button onClick={() => setActiveImage((i) => (i + 1) % images.length)} className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full glass-nav flex items-center justify-center hover:bg-primary hover:text-background transition-all text-foreground" aria-label="Next"><ChevronRight size={18} /></button>
                    </>
                  )}
                </div>
                {images.length > 1 && (
                  <div className="flex gap-2">
                    {images.map((img, i) => (
                      <button key={i} onClick={() => setActiveImage(i)} className={`relative h-16 w-16 rounded-lg overflow-hidden border-2 transition-all ${i === activeImage ? "border-primary shadow-sm" : "border-transparent opacity-60 hover:opacity-100"}`}>
                        <Image src={img} alt="" fill sizes="64px" className="object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={0.1}>
              <div className="flex flex-col gap-5">
                <div className="flex flex-wrap gap-2">
                  <Badge>{product.category}</Badge>
                  {product.tags?.map((tag) => (
                    <Badge key={tag} variant="default" className="bg-foreground/5 text-foreground/50">{tag}</Badge>
                  ))}
                </div>
                <h1 className="font-black text-[2rem] md:text-[2.8rem] leading-[0.92] tracking-[-0.04em] m-0 text-foreground">{product.title}</h1>
                {product.rating && (
                  <div className="flex items-center gap-3">
                    <StarRating rating={product.rating} />
                    <span className="text-sm font-bold text-foreground/60">{product.rating} ({product.reviewCount} {t("common.reviews")})</span>
                  </div>
                )}
                <p className="text-foreground/60 text-base leading-relaxed m-0">{product.description}</p>
                <div className="bg-muted rounded-2xl p-5 flex flex-col gap-3 border border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-widest text-foreground/50">{t("common.unitPrice")}</span>
                    <span className="font-bold text-foreground">{formatPrice(product.price)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-widest text-foreground/50">{t("common.quantity")}</span>
                    <div className="flex items-center gap-2 bg-background rounded-full px-3 h-9">
                      <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="h-7 w-7 rounded-full flex items-center justify-center hover:bg-foreground/5 transition-colors text-foreground" aria-label="Decrease"><Minus size={13} /></button>
                      <motion.span key={quantity} initial={{ scale: 1.2, opacity: 0.5 }} animate={{ scale: 1, opacity: 1 }} className="font-bold text-sm w-6 text-center text-foreground">{quantity}</motion.span>
                      <button onClick={() => setQuantity(quantity + 1)} className="h-7 w-7 rounded-full flex items-center justify-center hover:bg-foreground/5 transition-colors text-foreground" aria-label="Increase"><Plus size={13} /></button>
                    </div>
                  </div>
                  <div className="h-px bg-border" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold uppercase tracking-widest text-foreground">{t("common.total")}</span>
                    <motion.p key={totalPrice} initial={{ opacity: 0.5, y: -4 }} animate={{ opacity: 1, y: 0 }} className="font-black text-2xl text-primary m-0">{formatPrice(totalPrice)}</motion.p>
                  </div>
                  <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full w-fit ${inStock ? "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300" : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"}`}>
                    {inStock ? t("common.inStock") : t("common.madeToOrder")}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button size="lg" href={quoteHref} className="flex-1 sm:flex-none"><ShoppingBag size={18} /> {t("common.requestQuote")}</Button>
                  <Button variant="outline" size="lg" href={`/contact?product=${encodeURIComponent(product.title)}&qty=${quantity}`}><MessageCircle size={18} /> {t("common.enquire")}</Button>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border">
                  {trustBadges.map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-2 text-xs font-bold text-foreground/55">
                      <Icon size={14} className="text-primary shrink-0" />{text}
                    </div>
                  ))}
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-12 lg:px-16 py-10 bg-muted/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-1 mb-8 bg-background rounded-full p-1 w-fit flex-wrap">
            {(["specs", "features", "reviews"] as const).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${activeTab === tab ? "bg-primary text-background shadow-sm" : "text-foreground/50 hover:text-foreground"}`}>
                {tab === "specs" ? t("common.specifications") : tab === "features" ? t("common.features") : `${t("common.reviews")} (${reviews.length})`}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25, ease: EASE }}>
              {activeTab === "specs" && product.specifications && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {product.specifications.map((spec) => (
                    <div key={spec.label} className="card-elevated p-4">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 m-0 mb-1">{spec.label}</p>
                      <p className="font-bold text-sm text-foreground m-0">{spec.value}</p>
                    </div>
                  ))}
                </div>
              )}
              {activeTab === "features" && product.features && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-3xl">
                  {product.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3 p-4 card-elevated">
                      <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5"><Check size={12} className="text-primary" /></div>
                      <p className="text-sm text-foreground/70 m-0 leading-relaxed">{feature}</p>
                    </div>
                  ))}
                </div>
              )}
              {activeTab === "reviews" && (
                <div className="flex flex-col gap-4 max-w-3xl">
                  {reviews.length === 0 ? (
                    <p className="text-foreground/50 text-sm">{t("common.noReviews")}</p>
                  ) : (
                    reviews.map((review) => (
                      <div key={review.id} className="card-elevated p-5">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center font-bold text-sm text-primary">{review.author[0]}</div>
                            <div>
                              <p className="font-bold text-sm m-0 text-foreground">{review.author}</p>
                              <p className="text-[10px] text-foreground/40 m-0">{review.date}</p>
                            </div>
                          </div>
                          <StarRating rating={review.rating} size={12} />
                        </div>
                        <p className="text-sm text-foreground/60 leading-relaxed m-0">{review.comment}</p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {related.length > 0 && (
        <section className="px-6 md:px-12 lg:px-16 py-12">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-black text-2xl tracking-tight mb-8 text-foreground">{t("common.youMayAlsoLike")}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((item, i) => (
                <RevealOnScroll key={item.id} delay={i * 0.08}>
                  <Link href={`/products/${productPath(item)}`} className="group block no-underline text-foreground">
                    <article className="card-elevated overflow-hidden">
                      <div className="relative aspect-4/3 overflow-hidden">
                        <Image src={item.image_url} alt={item.title} fill sizes="33vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                      </div>
                      <div className="p-4 flex justify-between items-center">
                        <div>
                          <p className="font-black text-base m-0 group-hover:text-primary transition-colors">{item.title}</p>
                          <p className="text-sm font-bold text-primary m-0 mt-1">{formatPrice(item.price)}</p>
                        </div>
                        <ArrowUpRight size={18} className="text-foreground/30 group-hover:text-primary transition-colors" />
                      </div>
                    </article>
                  </Link>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
