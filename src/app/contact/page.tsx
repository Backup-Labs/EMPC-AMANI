"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 15 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.45, ease: "easeOut", delay },
});

const contactInfo = [
  { icon: "✉", label: "info@empc-amani.com" },
  { icon: "📍", label: "Lane London EC1R 0BJ United Kingdom" },
  { icon: "📞", label: "+1-555-44-456" },
];

const faqs = [
  { q: "How do you work?", a: "We begin with a discovery consultation to understand your vision, lifestyle, and budget. We then create concept designs, get your approval, and manage the full execution." },
  { q: "What spaces do you design?", a: "We design residential homes, commercial offices, retail spaces, hospitality venues, and more — from a single room to an entire building." },
  { q: "Do you work globally?", a: "Yes. We have handled projects across Europe, Africa, the Middle East and beyond, both on-site and remotely via our Virtual Design service." },
  { q: "How long does a project take?", a: "A typical residential project takes 8–16 weeks from concept to completion, depending on scope, customisation, and procurement timelines." },
  { q: "Can I hire you for one room?", a: "Absolutely. We offer both single-room styling and full-home transformation packages to suit all needs and budgets." },
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
    <div className="bg-[#f0f0f0] min-h-screen">

      {/* ── HERO ── */}
      <section className="relative h-[52vh] min-h-[350px] overflow-hidden">
        <Image src="/images/hero.png" alt="Contact Us" fill sizes="100vw" priority className="object-cover" />
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-x-0 bottom-0 px-6 md:px-12 lg:px-16 pb-12 lg:pb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-10">
          <h1 className="font-extrabold text-[2.8rem] md:text-[4.5rem] lg:text-[6rem] leading-[0.95] tracking-[-0.04em] text-white m-0">
            Contact Us
          </h1>
          <p className="text-white/70 text-sm md:text-base leading-relaxed max-w-sm m-0">
            Have a space in mind? We&apos;re ready to listen, collaborate, and create extraordinary.
          </p>
        </div>
      </section>

      {/* ── CONTACT + FORM ── */}
      <section className="px-6 md:px-12 lg:px-16 py-12 lg:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-12 lg:gap-20 items-start">

            {/* Left: contact info + image */}
            <div className="flex flex-col gap-4 lg:gap-6">
              {contactInfo.map((info, i) => (
                <motion.div key={i} {...fade(i * 0.06)}
                  className="flex items-center gap-4 bg-[#e8e8e8] rounded-2xl p-4 md:p-5 hover:bg-[#e0e0e0] transition-colors">
                  <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-[#d8d8d8] flex items-center justify-center text-xl shrink-0">
                    {info.icon}
                  </div>
                  <p className="text-sm md:text-base font-bold text-[#333] m-0 break-words">{info.label}</p>
                </motion.div>
              ))}
              <motion.div {...fade(0.2)} className="relative rounded-3xl overflow-hidden aspect-[4/3] mt-4 lg:mt-6 shadow-sm">
                <Image src="/images/project2.png" alt="Our Studio" fill sizes="(max-width:1024px) 100vw, 33vw" className="object-cover" />
              </motion.div>
            </div>

            {/* Right: form */}
            <motion.div {...fade(0.1)}
              className="bg-[#e8e8e8] rounded-3xl p-8 lg:p-12 shadow-xs">
              <p className="font-bold text-lg md:text-xl text-[#333] mb-8">Ready to start? Get in touch.</p>
              <form onSubmit={handleSubmit} className="flex flex-col gap-6 md:gap-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2.5">
                    <label className="text-[11px] font-bold text-[#888] tracking-widest uppercase">First Name</label>
                    <input required type="text" placeholder="Jane" className="w-full bg-white rounded-xl border border-transparent p-4 text-sm font-medium outline-hidden focus:border-[#111] transition-all" />
                  </div>
                  <div className="flex flex-col gap-2.5">
                    <label className="text-[11px] font-bold text-[#888] tracking-widest uppercase">Last Name</label>
                    <input required type="text" placeholder="Smith" className="w-full bg-white rounded-xl border border-transparent p-4 text-sm font-medium outline-hidden focus:border-[#111] transition-all" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2.5">
                    <label className="text-[11px] font-bold text-[#888] tracking-widest uppercase">Email</label>
                    <input required type="email" placeholder="jane.smith@example.com" className="w-full bg-white rounded-xl border border-transparent p-4 text-sm font-medium outline-hidden focus:border-[#111] transition-all" />
                  </div>
                  <div className="flex flex-col gap-2.5">
                    <label className="text-[11px] font-bold text-[#888] tracking-widest uppercase">Contact Number</label>
                    <input required type="tel" placeholder="+44 20 7946 0958" className="w-full bg-white rounded-xl border border-transparent p-4 text-sm font-medium outline-hidden focus:border-[#111] transition-all" />
                  </div>
                </div>
                <div className="flex flex-col gap-2.5">
                  <label className="text-[11px] font-bold text-[#888] tracking-widest uppercase">Notes</label>
                  <textarea rows={5} placeholder="Tell us about your project..." className="w-full bg-white rounded-xl border border-transparent p-4 text-sm font-medium outline-hidden focus:border-[#111] transition-all resize-none" />
                </div>
                <button type="submit" disabled={submitted} className={`
                  w-full rounded-xl py-5 px-8 font-bold text-base transition-all active:scale-[0.98]
                  ${submitted ? "bg-[#4caf50] cursor-default" : "bg-[#111] hover:bg-[#333] cursor-pointer"}
                  text-white shadow-lg
                `}>
                  {submitted ? "Message Sent ✓" : "Send Message"}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="px-6 md:px-12 lg:px-16 pb-20 lg:pb-32">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12 lg:gap-24">
            {/* Left */}
            <motion.div {...fade()} className="flex flex-col gap-6">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#111] block" />
                <span className="font-medium text-[13px] text-[#111]">FAQ</span>
              </div>
              <h2 className="font-bold text-[1.8rem] md:text-[2.2rem] lg:text-[2.8rem] leading-[1.1] tracking-[-0.03em] m-0">
                Looking for Clarity?<br className="hidden md:block" /> We&apos;re Here to Help
              </h2>
              <p className="text-[#666] text-sm md:text-base leading-relaxed m-0 max-w-sm">
                Designing a space comes with many questions. We&apos;ve answered some of the most common ones here.
              </p>
            </motion.div>

            {/* Right: accordion */}
            <div className="flex flex-col gap-4">
              {faqs.map((faq, i) => (
                <motion.div key={i} {...fade(i * 0.04)}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className={`
                      w-full flex items-center justify-between p-6 md:p-8 rounded-2xl transition-all duration-300 group
                      ${openFaq === i ? "bg-white shadow-xl" : "bg-[#e8e8e8] hover:bg-[#e0e0e0]"}
                    `}
                  >
                    <span className="font-bold text-sm md:text-base text-[#111] pr-6">{faq.q}</span>
                    <div className={`
                      h-8 w-8 md:h-10 md:w-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-300
                      ${openFaq === i ? "bg-[#111] text-white rotate-180" : "bg-white text-[#111] group-hover:scale-110"}
                    `}>
                      {openFaq === i ? <Minus size={14} /> : <Plus size={14} />}
                    </div>
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden bg-white rounded-b-2xl -mt-4 px-8 pb-8 pt-6 shadow-xl"
                      >
                        <p className="text-[#555] text-sm md:text-[15px] leading-relaxed m-0">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
