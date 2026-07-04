"use client";

import React, { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  message: string;
  rating: number;
  avatar_url?: string | null;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} size={14} className={cn(s <= rating ? "star-filled fill-current" : "star-empty")} />
      ))}
    </div>
  );
}

function TestimonialSlide({ t }: { t: Testimonial }) {
  return (
    <article className="shrink-0 w-[320px] sm:w-95 md:w-105 card-layered p-6 md:p-8 flex flex-col gap-5 mx-3">
      <StarRating rating={t.rating} />
      <p className="text-base md:text-lg text-foreground/80 leading-relaxed italic m-0 line-clamp-4">
        &ldquo;{t.message}&rdquo;
      </p>
      <div className="flex items-center gap-3 pt-4 border-t border-border/40 mt-auto">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-sm text-primary overflow-hidden shrink-0">
          {t.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={t.avatar_url} alt="" className="h-full w-full object-cover" />
          ) : (
            t.name[0]
          )}
        </div>
        <div>
          <p className="font-bold text-sm text-foreground m-0">{t.name}</p>
          <p className="text-[10px] font-bold text-foreground/50 uppercase tracking-wide m-0">{t.role}</p>
        </div>
      </div>
    </article>
  );
}

export function TestimonialsCarousel() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    supabase
      .from("testimonials")
      .select("id, name, role, message, rating, avatar_url")
      .eq("approved", true)
      .order("created_at", { ascending: false })
      .limit(12)
      .then(({ data }) => {
        setTestimonials(data || []);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex gap-6 overflow-hidden py-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="shrink-0 w-95 h-48 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (!testimonials.length) {
    return (
      <div className="text-center py-12 bg-muted rounded-2xl border border-border/40">
        <p className="text-foreground/50 m-0 font-medium">No reviews approved yet.</p>
      </div>
    );
  }

  const loop = testimonials.length < 4 ? [...testimonials, ...testimonials, ...testimonials] : [...testimonials, ...testimonials];

  return (
    <div
      className="relative overflow-hidden py-4 -mx-6 md:-mx-12 lg:-mx-16"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-24 bg-linear-to-r from-background to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-24 bg-linear-to-l from-background to-transparent z-10" />

      <div
        className={cn("flex w-max testimonial-marquee", paused && "testimonial-marquee-paused")}
        style={{ "--marquee-duration": `${Math.max(testimonials.length * 8, 32)}s` } as React.CSSProperties}
      >
        {loop.map((t, i) => (
          <TestimonialSlide key={`${t.id}-${i}`} t={t} />
        ))}
      </div>
    </div>
  );
}
