"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, ArrowUpRight } from "lucide-react";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 15 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as any, delay },
});

// Shared section-label row (Responsive)
function SectionHeader({ label, heading, desc, rightEl }: { label: string; heading: React.ReactNode; desc?: string; rightEl?: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr_1fr] gap-10 lg:gap-16 py-20 lg:py-32 border-b border-black/5">
      {/* Label */}
      <div className="flex items-start gap-4 pt-2">
        <span className="w-2.5 h-2.5 rounded-full bg-black shrink-0 mt-2 block" />
        <span className="font-black text-[14px] uppercase tracking-widest text-[#111]">{label}</span>
      </div>
      {/* Heading */}
      <div>
        <h2 className="font-black text-[2.5rem] md:text-[3.2rem] lg:text-[3.8rem] leading-[0.9] tracking-[-0.05em] text-[#111] m-0">
          {heading}
        </h2>
      </div>
      {/* Description / CTA */}
      <div className="flex flex-col justify-between gap-6">
        {desc && <p className="text-lg text-[#555] leading-relaxed m-0 max-w-sm">{desc}</p>}
        {rightEl}
      </div>
    </div>
  );
}

const faqs = [
  { q: "How do you work?", a: "We begin with a discovery consultation to understand your vision, lifestyle, and budget. We then create concept designs, get your approval, and manage the full execution." },
  { q: "What spaces do you design?", a: "We design residential homes, commercial offices, retail spaces, hospitality venues, and more." },
  { q: "Do you work globally?", a: "Yes. We have handled projects across Europe, Africa, the Middle East and beyond, both on-site and remotely." },
  { q: "How long does a project take?", a: "A typical residential project takes 8–16 weeks from concept to completion, depending on scope." },
];

export default function Contact() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="bg-white min-h-screen overflow-x-hidden relative text-[#111]">

      {/* ── HERO ── */}
      <section className="relative h-[60vh] min-h-[500px] overflow-hidden bg-black flex items-end">
        <div className="absolute inset-0 grayscale opacity-40">
          <Image src="/images/hero.png" alt="Contact" fill priority sizes="100vw" className="object-cover" />
        </div>
        <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.05)_0%,transparent_60%)]" />
        
        <div className="container mx-auto px-6 md:px-12 lg:px-16 pb-24 relative z-10 max-w-7xl w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" as any }}
          >
            <span className="font-black text-white/50 uppercase tracking-[0.3em] text-[11px] mb-8 block">Get in Touch</span>
            <h1 className="font-black text-[3.5rem] md:text-[5.5rem] lg:text-[7rem] leading-[0.85] tracking-[-0.05em] text-white m-0">
              Start Your<br />Story.
            </h1>
          </motion.div>
        </div>
      </section>

      {/* ── FORM SECTION ── */}
      <section className="px-6 md:px-12 lg:px-16 container mx-auto max-w-7xl py-32">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-24 lg:gap-32">
          
          {/* Info */}
          <div className="flex flex-col gap-16 lg:gap-20">
            <div>
              <p className="font-black text-[3.5rem] leading-[0.9] tracking-[-0.05em] mb-8">Hello.</p>
              <p className="text-[#555] text-xl leading-relaxed m-0">
                Whether it&#39;s a full-scale renovation or a single-room update, we are ready to collaborate on your next vision.
              </p>
            </div>
            
            <div className="flex flex-col gap-10">
              {[
                { label: "Studio", value: "Amani Lane London EC1R" },
                { label: "Email", value: "info@empc-amani.com" },
                { label: "Phone", value: "+1-555-44-456" }
              ].map((item, i) => (
                <div key={i} className="flex flex-col border-b border-black/5 pb-8">
                  <span className="text-[11px] font-black uppercase tracking-widest text-[#aaa] mb-2">{item.label}</span>
                  <span className="text-xl font-bold text-[#111]">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="glass rounded-[48px] p-12 lg:p-16 shadow-3xl">
            <form onSubmit={handleSubmit} className="flex flex-col gap-10">
              <div className="grid grid-cols-2 gap-8">
                <div className="flex flex-col gap-3">
                  <label className="text-[11px] font-black uppercase tracking-widest text-[#aaa]">Name</label>
                  <input required placeholder="Name" className="h-14 bg-transparent border-b border-black/10 focus:border-black outline-none font-bold text-lg transition-colors" />
                </div>
                <div className="flex flex-col gap-3">
                  <label className="text-[11px] font-black uppercase tracking-widest text-[#aaa]">Email</label>
                  <input required type="email" placeholder="Email" className="h-14 bg-transparent border-b border-black/10 focus:border-black outline-none font-bold text-lg transition-colors" />
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <label className="text-[11px] font-black uppercase tracking-widest text-[#aaa]">Inquiry Type</label>
                <select className="h-14 bg-transparent border-b border-black/10 focus:border-black outline-none font-bold text-lg transition-colors cursor-pointer">
                  <option>Residential</option>
                  <option>Commercial</option>
                  <option>Bespoke Consultation</option>
                </select>
              </div>
              <div className="flex flex-col gap-3">
                <label className="text-[11px] font-black uppercase tracking-widest text-[#aaa]">Message</label>
                <textarea rows={4} placeholder="Your vision..." className="bg-transparent border-b border-black/10 focus:border-black outline-none font-bold text-lg transition-colors resize-none" />
              </div>
              <button 
                type="submit" 
                disabled={submitted}
                className="inline-flex h-16 items-center px-12 rounded-full bg-[#111] text-white font-black hover:bg-black transition-all shadow-xl group self-start disabled:opacity-50 disabled:bg-green-600"
              >
                {submitted ? "Message Sent" : "Send Inquiry"} <ArrowUpRight size={20} className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
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
                className={`w-full flex items-center justify-between p-10 rounded-[32px] transition-all duration-500 group ${openFaq === i ? "bg-black text-white" : "glass hover:bg-black hover:text-white"}`}
              >
                <span className="font-black text-xl text-left tracking-tighter">{faq.q}</span>
                <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-500 ${openFaq === i ? "bg-white text-black rotate-180" : "bg-black/5 group-hover:bg-white group-hover:text-black"}`}>
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
                    <p className="text-lg leading-relaxed text-[#555] m-0">{faq.a}</p>
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
