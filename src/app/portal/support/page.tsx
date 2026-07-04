"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Star, Send } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { StarRating } from "@/components/admin/ui/StarRating";
import { useToast } from "@/components/ui/Toast";

export default function PortalSupportPage() {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [myTestimonials, setMyTestimonials] = useState<{ id: string; message: string; approved: boolean; rating: number; created_at: string }[]>([]);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const displayName = session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email?.split("@")[0] || "";
    setName(displayName);

    const { data } = await supabase
      .from("testimonials")
      .select("id, message, approved, rating, created_at")
      .eq("name", displayName)
      .order("created_at", { ascending: false });

    setMyTestimonials(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSubmitting(true);

    const { data: { session } } = await supabase.auth.getSession();
    const avatar = session?.user.user_metadata?.avatar_url || session?.user.user_metadata?.picture || null;

    const { error } = await supabase.from("testimonials").insert([{
      name: name.trim(),
      role: role.trim() || "Customer",
      message: message.trim(),
      rating,
      approved: false,
      avatar_url: avatar,
    }]);

    if (error) {
      toast("Failed to submit testimonial", "error");
    } else {
      toast("Testimonial submitted for review!");
      setMessage("");
      setRole("");
      loadProfile();
    }
    setSubmitting(false);
  };

  return (
    <div className="max-w-3xl flex flex-col gap-8">
      <div>
        <span className="font-bold text-[11px] uppercase tracking-widest text-primary">Support</span>
        <h1 className="font-black text-3xl tracking-tight mt-2 mb-0">Help & Testimonials</h1>
        <p className="text-foreground/50 text-sm mt-2 font-medium">Share your experience or reach out for assistance.</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card-elevated p-6 md:p-8 border border-border/40">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Star size={18} className="text-primary" />
          </div>
          <div>
            <h2 className="font-black text-lg m-0">Leave a Testimonial</h2>
            <p className="text-xs text-foreground/50 font-medium m-0">Your review will appear after staff approval.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Your Name</label>
              <input required type="text" value={name} onChange={(e) => setName(e.target.value)} className="h-11 bg-transparent border-b border-border focus:border-primary outline-none font-bold text-sm" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Position (optional)</label>
              <input type="text" value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g. Homeowner" className="h-11 bg-transparent border-b border-border focus:border-primary outline-none font-bold text-sm" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Rating</label>
            <StarRating value={rating} onChange={setRating} size={22} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Your Testimonial</label>
            <textarea required rows={4} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Tell us about your experience with EMPC..." className="bg-muted/30 border border-border rounded-xl focus:border-primary outline-none font-medium text-sm p-4 resize-none" />
          </div>

          <button type="submit" disabled={submitting} className="h-12 bg-primary text-background font-black rounded-full flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 cursor-pointer w-fit px-8">
            <Send size={16} /> {submitting ? "Submitting..." : "Submit Testimonial"}
          </button>
        </form>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card-elevated p-6 md:p-8 border border-border/40">
        <div className="flex items-center gap-3 mb-4">
          <MessageSquare size={18} className="text-primary" />
          <h2 className="font-black text-lg m-0">Contact Support</h2>
        </div>
        <p className="text-sm text-foreground/60 font-medium mb-4">
          For order issues, quotes, or general inquiries, use the contact form on our website or submit a request from your dashboard.
        </p>
        <a href="/contact" className="inline-flex h-10 items-center px-5 rounded-full border-2 border-primary text-primary font-black text-sm no-underline hover:bg-primary/5 transition-colors">
          Go to Contact Page
        </a>
      </motion.div>

      {myTestimonials.length > 0 && (
        <div>
          <h3 className="font-black text-sm uppercase tracking-wider text-foreground/50 mb-4">Your Submissions</h3>
          <div className="flex flex-col gap-3">
            {myTestimonials.map((t) => (
              <div key={t.id} className="card-elevated p-4 border border-border/40">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <StarRating value={t.rating} readonly size={14} />
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    t.approved ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                  }`}>
                    {t.approved ? "Published" : "Pending Review"}
                  </span>
                </div>
                <p className="text-sm font-medium text-foreground/80 m-0">{t.message}</p>
                <p className="text-[10px] text-foreground/40 font-bold mt-2 m-0">{new Date(t.created_at).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
