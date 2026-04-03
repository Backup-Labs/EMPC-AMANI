"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
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

  const inputStyle: React.CSSProperties = {
    width: "100%", borderRadius: "8px", border: "1px solid #e0e0e0",
    padding: "10px 14px", fontSize: "13px", outline: "none",
    fontFamily: "'Satoshi', sans-serif", background: "white", color: "#111",
    boxSizing: "border-box",
  };

  return (
    <div style={{ fontFamily: "'Satoshi', sans-serif", background: "#f0f0f0" }}>

      {/* ── HERO ── */}
      <section style={{ position: "relative", height: "52vh", minHeight: "320px", overflow: "hidden" }}>
        <Image src="/images/hero.png" alt="Contact Us" fill sizes="100vw" priority style={{ objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "40px 48px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "32px" }}>
          <h1 style={{ fontWeight: 800, fontSize: "clamp(2.5rem, 6vw, 5rem)", letterSpacing: "-0.04em", lineHeight: 1, color: "#fff", margin: 0 }}>
            Contact Us
          </h1>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "14px", lineHeight: 1.65, maxWidth: "300px", margin: 0 }}>
            Have a space in mind? We&apos;re ready to listen, collaborate, and create extraordinary.
          </p>
        </div>
      </section>

      {/* ── CONTACT + FORM ── */}
      <section>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "64px 48px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: "40px", alignItems: "flex-start" }}>

            {/* Left: contact info + image */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {contactInfo.map((info, i) => (
                <motion.div key={i} {...fade(i * 0.06)}
                  style={{ display: "flex", alignItems: "center", gap: "12px", background: "#e8e8e8", borderRadius: "12px", padding: "12px 16px" }}>
                  <div style={{ height: "36px", width: "36px", borderRadius: "50%", background: "#d8d8d8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", flexShrink: 0 }}>
                    {info.icon}
                  </div>
                  <p style={{ fontSize: "13px", fontWeight: 500, color: "#333", margin: 0 }}>{info.label}</p>
                </motion.div>
              ))}
              <motion.div {...fade(0.2)} style={{ position: "relative", borderRadius: "16px", overflow: "hidden", aspectRatio: "4/3", marginTop: "8px" }}>
                <Image src="/images/project2.png" alt="Our Studio" fill sizes="33vw" style={{ objectFit: "cover" }} />
              </motion.div>
            </div>

            {/* Right: form */}
            <motion.div {...fade(0.1)}
              style={{ background: "#e8e8e8", borderRadius: "20px", padding: "32px" }}>
              <p style={{ fontWeight: 600, fontSize: "15px", color: "#555", margin: "0 0 24px" }}>Contact Information</p>
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontSize: "11px", fontWeight: 600, color: "#777", letterSpacing: "0.04em" }}>First Name</label>
                    <input required type="text" placeholder="Jane" style={inputStyle} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontSize: "11px", fontWeight: 600, color: "#777", letterSpacing: "0.04em" }}>Last Name</label>
                    <input required type="text" placeholder="Smith" style={inputStyle} />
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontSize: "11px", fontWeight: 600, color: "#777", letterSpacing: "0.04em" }}>Email</label>
                    <input required type="email" placeholder="intereo@framer.com" style={inputStyle} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontSize: "11px", fontWeight: 600, color: "#777", letterSpacing: "0.04em" }}>Contact Number</label>
                    <input required type="tel" placeholder="+91 8772 62627" style={inputStyle} />
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "11px", fontWeight: 600, color: "#777", letterSpacing: "0.04em" }}>Notes</label>
                  <textarea rows={4} placeholder="Let's work together!" style={{ ...inputStyle, resize: "none" }} />
                </div>
                <button type="submit" style={{
                  width: "100%", borderRadius: "8px", padding: "13px",
                  background: submitted ? "#4caf50" : "#6b5840",
                  color: "white", fontFamily: "'Satoshi', sans-serif", fontWeight: 700,
                  fontSize: "14px", border: "none", cursor: submitted ? "default" : "pointer",
                  transition: "background 0.3s",
                }}>
                  {submitted ? "Message Sent ✓" : "Submit"}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 48px 80px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "64px" }}>
            {/* Left */}
            <motion.div {...fade()} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#111", display: "block" }} />
                <span style={{ fontWeight: 500, fontSize: "13px", color: "#111" }}>FAQ</span>
              </div>
              <h2 style={{ fontWeight: 700, fontSize: "clamp(1.4rem, 2.5vw, 2rem)", lineHeight: 1.2, letterSpacing: "-0.025em", margin: 0 }}>
                Looking for Clarity?<br />We&apos;re Here to Help
              </h2>
              <p style={{ color: "#666", fontSize: "13px", lineHeight: 1.7, margin: 0 }}>
                Designing a space comes with many questions we&apos;ve answered.
              </p>
            </motion.div>

            {/* Right: accordion */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {faqs.map((faq, i) => (
                <motion.div key={i} {...fade(i * 0.04)}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    style={{
                      width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "16px 20px", borderRadius: "12px", background: openFaq === i ? "#e0e0e0" : "#e8e8e8",
                      border: "none", cursor: "pointer", textAlign: "left", fontFamily: "'Satoshi', sans-serif",
                      transition: "background 0.2s",
                    }}
                  >
                    <span style={{ fontWeight: 500, fontSize: "14px", color: "#111" }}>{faq.q}</span>
                    <div style={{
                      height: "28px", width: "28px", borderRadius: "50%",
                      background: openFaq === i ? "#111" : "#d0d0d0",
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginLeft: "16px",
                      transition: "background 0.2s",
                    }}>
                      {openFaq === i
                        ? <Minus size={12} color="white" />
                        : <Plus size={12} color="#555" />}
                    </div>
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22 }}
                        style={{ overflow: "hidden" }}
                      >
                        <p style={{ padding: "14px 20px 6px", color: "#555", fontSize: "13px", lineHeight: 1.75, margin: 0 }}>
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
