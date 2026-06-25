"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, ArrowUpRight } from "lucide-react";
import { supabase } from "@/lib/supabase";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 15 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as any, delay },
});

// Shared section-label row (Responsive)
function SectionHeader({ label, heading, desc, rightEl }: { label: string; heading: React.ReactNode; desc?: string; rightEl?: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr_1fr] gap-10 lg:gap-16 py-12 lg:py-20 border-b border-border">
      {/* Label */}
      <div className="flex items-start gap-4 pt-2">
        <span className="w-2.5 h-2.5 rounded-full bg-primary shrink-0 mt-2 block" />
        <span className="font-black text-[14px] uppercase tracking-widest text-foreground">{label}</span>
      </div>
      {/* Heading */}
      <div>
        <h2 className="font-black text-[2.5rem] md:text-[3.2rem] lg:text-[3.8rem] leading-[0.9] tracking-[-0.05em] text-foreground m-0">
          {heading}
        </h2>
      </div>
      {/* Description / CTA */}
      <div className="flex flex-col justify-between gap-6">
        {desc && <p className="text-lg text-foreground/60 leading-relaxed m-0 max-w-sm">{desc}</p>}
        {rightEl}
      </div>
    </div>
  );
}

const faqs = [
  { q: "Do you make custom furniture?", a: "Yes, every piece is made to order. We work with you to choose the wood type, finish, and dimensions that perfectly suit your space." },
  { q: "Can I join an internship?", a: "We offer internship programs through RTB and other vocational partners. Contact us with your educational background to learn more." },
  { q: "Do you ship worldwide?", a: "Yes. Our hand-crafted pieces are carefully crated and shipped globally. We ensure every piece arrives in perfect condition." },
  { q: "How long is the waitlist?", a: "Bespoke pieces typically take 6–10 weeks depending on the complexity and wood availability." },
];

export default function Contact() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [inquiryType, setInquiryType] = useState("furniture");
  const [message, setMessage] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !message) return;

    setSubmitting(true);
    setErrorMsg("");
    try {
      const { error } = await supabase.from("inquiries").insert([
        {
          full_name: name,
          email: email || null,
          phone: phone || null,
          subject: subject || null,
          message,
          inquiry_type: inquiryType,
          status: "new",
        },
      ]);

      if (error) throw error;

      setSubmitted(true);
      setName("");
      setEmail("");
      setPhone("");
      setSubject("");
      setMessage("");
      setInquiryType("furniture");

      setTimeout(() => setSubmitted(false), 5000);
    } catch (err: any) {
      console.error("Error submitting inquiry:", err);
      setErrorMsg(err.message || "Failed to send inquiry. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-background min-h-screen overflow-x-hidden relative text-foreground transition-colors duration-300">

      {/* ── HERO ── */}
      <section className="relative h-[65vh] min-h-125 overflow-hidden">
        <Image src="/images/hero.png" alt="Contact" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-linear-to-b from-black/60 via-transparent to-black/40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,0,0,0.05)_0%,transparent_60%)]" />
        
        {/* Hero Content */}
        <div className="absolute inset-x-0 bottom-0 pb-16 lg:pb-24 px-6 md:px-12 lg:px-16 container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" as any }}
              className="font-black text-[3rem] md:text-[4.5rem] lg:text-[6.5rem] leading-[0.85] tracking-[-0.05em] text-white m-0"
            >
              Start Your<br />Story.
            </motion.h1>
            <p className="text-white/80 text-lg md:text-xl leading-relaxed max-w-sm m-0">
              Get in touch to begin your bespoke design journey with our master artisans.
            </p>
          </div>
        </div>
      </section>

      {/* ── FORM SECTION ── */}
      <section className="px-6 md:px-12 lg:px-16 container mx-auto max-w-7xl py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-24 lg:gap-32">
          
          {/* Info */}
          <div className="flex flex-col gap-16 lg:gap-20">
            <div>
              <p className="font-black text-[3.5rem] leading-[0.9] tracking-[-0.05em] mb-8">Hello.</p>
              <p className="text-foreground/60 text-xl leading-relaxed m-0">
                Whether it&#39;s a full-scale renovation or a single-room update, we are ready to collaborate on your next vision.
              </p>
            </div>
            
            <div className="flex flex-col gap-10">
              {[
                { label: "Studio", value: "Amani Lane London EC1R" },
                { label: "Email", value: "info@empc-amani.com" },
                { label: "Phone", value: "+1-555-44-456" }
              ].map((item, i) => (
                <div key={i} className="flex flex-col border-b border-border pb-8">
                  <span className="text-[11px] font-black uppercase tracking-widest text-foreground/40 mb-2">{item.label}</span>
                  <span className="text-xl font-bold text-foreground">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="card-layered p-12 lg:p-16">
            <form onSubmit={handleSubmit} className="flex flex-col gap-10">
              <div className="grid grid-cols-2 gap-8">
                <div className="flex flex-col gap-3">
                  <label className="text-[11px] font-black uppercase tracking-widest text-foreground/40">Name</label>
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name"
                    disabled={submitting}
                    className="h-14 bg-transparent border-b border-border focus:border-foreground outline-none font-bold text-lg transition-colors disabled:opacity-50"
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <label className="text-[11px] font-black uppercase tracking-widest text-foreground/40">Email</label>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    disabled={submitting}
                    className="h-14 bg-transparent border-b border-border focus:border-foreground outline-none font-bold text-lg transition-colors disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="flex flex-col gap-3">
                  <label className="text-[11px] font-black uppercase tracking-widest text-foreground/40">Phone (Optional)</label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Phone"
                    disabled={submitting}
                    className="h-14 bg-transparent border-b border-border focus:border-foreground outline-none font-bold text-lg transition-colors disabled:opacity-50"
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <label className="text-[11px] font-black uppercase tracking-widest text-foreground/40">Subject</label>
                  <input
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Subject"
                    disabled={submitting}
                    className="h-14 bg-transparent border-b border-border focus:border-foreground outline-none font-bold text-lg transition-colors disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-[11px] font-black uppercase tracking-widest text-foreground/40">Inquiry Type</label>
                <select
                  value={inquiryType}
                  onChange={(e) => setInquiryType(e.target.value)}
                  disabled={submitting}
                  className="h-14 bg-transparent border-b border-border focus:border-foreground outline-none font-bold text-lg transition-colors cursor-pointer appearance-none disabled:opacity-50"
                >
                  <option value="furniture" className="bg-background">Furniture Inquiry</option>
                  <option value="custom_order" className="bg-background">Custom Order</option>
                  <option value="training" className="bg-background">Carpentry Training</option>
                  <option value="general" className="bg-background">General Inquiry</option>
                </select>
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-[11px] font-black uppercase tracking-widest text-foreground/40">Message</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Your vision..."
                  disabled={submitting}
                  className="bg-transparent border-b border-border focus:border-foreground outline-none font-bold text-lg transition-colors resize-none disabled:opacity-50"
                />
              </div>

              <div className="flex flex-col gap-2">
                <button
                  type="submit"
                  disabled={submitting || submitted}
                  className={`inline-flex h-16 items-center px-12 rounded-full bg-primary text-background font-black hover:opacity-90 transition-all shadow-xl group self-start disabled:opacity-60 cursor-pointer`}
                >
                  {submitting ? "Sending..." : submitted ? "Message Sent" : "Send Inquiry"}
                  <ArrowUpRight size={20} className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
                {submitted && (
                  <p className="text-sm font-bold text-green-600 px-4 mt-2">
                    Thank you! Your inquiry has been submitted successfully.
                  </p>
                )}
                {errorMsg && (
                  <p className="text-sm font-bold text-red-500 px-4 mt-2">
                    {errorMsg}
                  </p>
                )}
              </div>
            </form>
          </div>

        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="px-6 md:px-12 lg:px-16 container mx-auto max-w-7xl pb-32">
        <SectionHeader
          label="Clarity"
          heading={<>Thinking of Something?</>}
          desc="We've answered some of the most common questions about our design process."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-20">
          {faqs.map((faq, i) => (
            <div key={i} className="flex flex-col gap-4">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className={`w-full flex items-center justify-between p-8 card-offset-border hover:scale-[1.01] transition-all duration-300 group ${openFaq === i ? "bg-primary text-background" : "bg-muted text-foreground"}`}
              >
                <span className="font-black text-xl text-left tracking-tighter">{faq.q}</span>
                <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${openFaq === i ? "bg-background text-primary rotate-180" : "bg-primary/10 group-hover:bg-primary group-hover:text-background text-primary"}`}>
                  {openFaq === i ? <Minus size={18} /> : <Plus size={18} />}
                </div>
              </button>
              <AnimatePresence>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" as any }}
                    className="overflow-hidden px-10 pb-10"
                  >
                    <p className="text-lg leading-relaxed text-foreground/60 m-0">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
