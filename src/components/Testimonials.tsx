"use client";

import React, { useState, useEffect } from "react";
import { Star, X, ArrowUpRight } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  message: string;
  rating: number;
  created_at: string;
}

export function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  
  // Form State
  const [name, setName] = useState("");
  const [role, setRole] = useState("Customer");
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .eq("approved", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTestimonials(data || []);
    } catch (err) {
      console.error("Error fetching testimonials:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !message) return;

    setSubmitting(true);
    try {
      const { error } = await supabase.from("testimonials").insert([
        {
          name,
          role,
          rating,
          message,
          approved: false, // Default is false anyway, but let's be explicit
        },
      ]);

      if (error) throw error;

      setSuccess(true);
      setName("");
      setRole("Customer");
      setRating(5);
      setMessage("");
      setTimeout(() => {
        setSuccess(false);
        setModalOpen(false);
      }, 3000);
    } catch (err) {
      console.error("Error submitting testimonial:", err);
      alert("Failed to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (num: number, interactive = false, onSelect?: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={interactive ? 24 : 16}
            onClick={() => interactive && onSelect && onSelect(star)}
            className={`
              ${star <= num ? "fill-primary text-primary" : "text-primary/20"}
              ${interactive ? "cursor-pointer hover:scale-110 transition-transform" : ""}
            `}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="py-16 md:py-24">
      {/* Testimonials Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
        </div>
      ) : testimonials.length === 0 ? (
        <div className="text-center py-12 bg-muted rounded-2xl border border-border/40">
          <p className="text-lg text-foreground/60 m-0 font-bold">No reviews approved yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {testimonials.map((t) => (
            <div key={t.id} className="card-layered p-8 flex flex-col justify-between shadow-sm">
              <div className="flex flex-col gap-6">
                {renderStars(t.rating)}
                <p className="text-lg text-foreground/80 leading-relaxed italic m-0">
                  &ldquo;{t.message}&rdquo;
                </p>
              </div>
              <div className="mt-8 border-t border-border/40 pt-4 flex flex-col">
                <span className="font-bold text-base text-foreground leading-tight">{t.name}</span>
                <span className="text-[12px] font-bold text-foreground/55 uppercase tracking-wide mt-1">
                  {t.role}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Share Button */}
      <div className="flex justify-center mt-16">
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex h-16 items-center px-10 rounded-full bg-primary text-background font-black hover:opacity-90 active:scale-95 transition-all shadow-xl group cursor-pointer"
        >
          Share Your Experience
          <ArrowUpRight size={20} className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </button>
      </div>

      {/* Modal Form */}
      {modalOpen && (
        <div
          onClick={() => setModalOpen(false)}
          className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-background rounded-3xl border border-border shadow-2xl overflow-hidden flex flex-col relative"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-border">
              <span className="font-black text-xl uppercase tracking-wider text-foreground">Write a Review</span>
              <button
                onClick={() => setModalOpen(false)}
                className="h-10 w-10 flex items-center justify-center rounded-full bg-muted hover:bg-foreground/10 text-foreground transition-transform active:scale-90"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content / Form */}
            {success ? (
              <div className="p-12 text-center flex flex-col items-center justify-center gap-4">
                <div className="h-14 w-14 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                  <Star className="fill-current" size={28} />
                </div>
                <h4 className="font-black text-2xl text-foreground">Review Submitted!</h4>
                <p className="text-foreground/60 text-base max-w-xs m-0">
                  Thank you! Your review will appear after approval.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 md:p-8 flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-foreground/40">
                    Your Name
                  </label>
                  <input
                    required
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    className="h-12 bg-transparent border-b border-border focus:border-foreground outline-none font-bold text-base transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-foreground/40">
                    Role / Background
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="h-12 bg-transparent border-b border-border focus:border-foreground outline-none font-bold text-base transition-colors cursor-pointer appearance-none"
                  >
                    <option value="Customer">Customer</option>
                    <option value="Carpentry Graduate">Carpentry Graduate</option>
                    <option value="Organization">Organization</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-foreground/40">
                    Overall Rating
                  </label>
                  <div className="pt-2">{renderStars(rating, true, setRating)}</div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-foreground/40">
                    Your Review
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your experience with EMPC..."
                    className="bg-transparent border-b border-border focus:border-foreground outline-none font-bold text-base transition-colors resize-none py-2"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-4 h-14 bg-primary text-background font-black rounded-full flex items-center justify-center hover:opacity-90 active:scale-95 transition-all shadow-lg disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
