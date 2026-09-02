"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, ArrowUpRight } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { NotRobotCheckbox } from "@/components/ui/NotRobotCheckbox";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

export default function ContactContent() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = useMemo(
    () => [
      { q: t("contact.faq1q"), a: t("contact.faq1a") },
      { q: t("contact.faq2q"), a: t("contact.faq2a") },
      { q: t("contact.faq3q"), a: t("contact.faq3a") },
      { q: t("contact.faq4q"), a: t("contact.faq4a") },
    ],
    [t]
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [inquiryType, setInquiryType] = useState("furniture");
  const [message, setMessage] = useState("");
  const [notRobot, setNotRobot] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const product = searchParams.get("product");
    const qty = searchParams.get("qty");
    const total = searchParams.get("total");
    const type = searchParams.get("type");
    if (product) {
      setSubject(product);
      setInquiryType(type || "custom_order");
      if (qty && total) {
        setMessage(
          `Product: ${product}\nQuantity: ${qty}\nEstimated total: ${Number(total).toLocaleString()} RWF\n\nPlease provide a formal quote.`
        );
      }
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !message) return;

    setSubmitting(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: name,
          email: email || undefined,
          phone: phone || null,
          subject: subject || null,
          message,
          inquiry_type: inquiryType,
          not_robot: notRobot,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to submit");
      setSubmitted(true);
      setName("");
      setEmail("");
      setPhone("");
      setSubject("");
      setMessage("");
      setInquiryType("furniture");
      setNotRobot(false);
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to send inquiry.";
      setErrorMsg(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-background min-h-screen overflow-x-hidden text-foreground">
      <section className="relative h-[55vh] min-h-105 overflow-hidden">
        <Image src="/images/hero.png" alt="Contact" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-linear-to-b from-black/60 via-transparent to-black/50" />
        <div className="absolute inset-x-0 bottom-0 pb-12 lg:pb-16 px-6 md:px-12 lg:px-16 container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="font-black text-[2.6rem] md:text-[4rem] lg:text-[5rem] leading-[0.88] tracking-[-0.04em] text-white m-0 nav-text-shadow"
            >
              {t("contact.heroTitle1")}<br />{t("contact.heroTitle2")}
            </motion.h1>
            <p className="text-white/85 text-base md:text-lg leading-relaxed max-w-sm m-0 nav-text-shadow">
              {t("contact.heroDesc")}
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-12 lg:px-16 container mx-auto max-w-7xl py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-12 lg:gap-20">
          <div className="flex flex-col gap-10">
            <div>
              <p className="font-black text-[2.5rem] leading-[0.9] tracking-[-0.04em] mb-5">{t("contact.hello")}</p>
              <p className="text-foreground/60 text-lg leading-relaxed m-0">{t("contact.intro")}</p>
            </div>
            <div className="flex flex-col gap-6">
              {[
                { label: t("contact.location"), value: "Musanze, Rwanda" },
                { label: t("contact.email"), value: "maniraguhapierrecelestin33@gmail.com" },
                { label: t("contact.phone"), value: "+250788516492" },
              ].map((item, i) => (
                <div key={i} className="flex flex-col border-b border-border pb-5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 mb-1">{item.label}</span>
                  <span className="text-lg font-bold text-foreground">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card-elevated p-8 lg:p-10">
            <form onSubmit={handleSubmit} className="flex flex-col gap-7">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/50">{t("contact.name")}</label>
                  <input required value={name} onChange={(e) => setName(e.target.value)} placeholder={t("contact.name")} disabled={submitting}
                    className="h-12 bg-transparent border-b border-border focus:border-primary outline-none font-bold text-base transition-colors disabled:opacity-50 text-foreground" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/50">{t("contact.email")}</label>
                  <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t("contact.email")} disabled={submitting}
                    className="h-12 bg-transparent border-b border-border focus:border-primary outline-none font-bold text-base transition-colors disabled:opacity-50 text-foreground" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/50">{t("contact.phoneOptional")}</label>
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={t("contact.phone")} disabled={submitting}
                    className="h-12 bg-transparent border-b border-border focus:border-primary outline-none font-bold text-base transition-colors disabled:opacity-50 text-foreground" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/50">{t("contact.subject")}</label>
                  <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder={t("contact.subject")} disabled={submitting}
                    className="h-12 bg-transparent border-b border-border focus:border-primary outline-none font-bold text-base transition-colors disabled:opacity-50 text-foreground" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/50">{t("contact.inquiryType")}</label>
                <select value={inquiryType} onChange={(e) => setInquiryType(e.target.value)} disabled={submitting}
                  className="h-12 bg-transparent border-b border-border focus:border-primary outline-none font-bold text-base transition-colors cursor-pointer appearance-none disabled:opacity-50 text-foreground">
                  <option value="furniture">{t("contact.inquiryFurniture")}</option>
                  <option value="custom_order">{t("contact.inquiryCustom")}</option>
                  <option value="training">{t("contact.inquiryTraining")}</option>
                  <option value="general">{t("contact.inquiryGeneral")}</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/50">{t("contact.message")}</label>
                <textarea required rows={4} value={message} onChange={(e) => setMessage(e.target.value)} placeholder={t("contact.yourVision")} disabled={submitting}
                  className="bg-transparent border-b border-border focus:border-primary outline-none font-bold text-base transition-colors resize-none disabled:opacity-50 text-foreground" />
              </div>
              <NotRobotCheckbox
                id="contact-not-robot"
                checked={notRobot}
                onChange={setNotRobot}
                disabled={submitting}
              />
              <div className="flex flex-col gap-2">
                <button type="submit" disabled={submitting || submitted || !notRobot}
                  className="inline-flex h-14 items-center px-10 rounded-full bg-primary text-background font-bold hover:opacity-90 transition-all shadow-md group self-start disabled:opacity-60 cursor-pointer">
                  {submitting ? t("common.sending") : submitted ? t("common.messageSent") : t("common.sendInquiry")}
                  <ArrowUpRight size={18} className="ml-2 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
                {submitted && <p className="text-sm font-bold text-green-700 mt-1">{t("contact.thankYou")}</p>}
                {errorMsg && <p className="text-sm font-bold text-red-600 mt-1">{errorMsg}</p>}
              </div>
            </form>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-12 lg:px-16 container mx-auto max-w-7xl pb-20">
        <SectionHeader label={t("contact.faqLabel")} heading={t("contact.faqHeading")} desc={t("contact.faqDesc")} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 py-10">
          {faqs.map((faq, i) => {
            const isOpen = openFaq === i;
            return (
              <div key={i} className="flex flex-col gap-0">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className={`w-full flex items-center justify-between p-6 rounded-xl border-2 transition-all duration-300 text-left ${
                    isOpen
                      ? "bg-primary border-primary text-white shadow-md"
                      : "bg-muted border-border text-foreground hover:border-primary/30 hover:shadow-sm"
                  }`}
                >
                  <span className={`font-bold text-base md:text-lg tracking-tight pr-4 ${isOpen ? "text-white" : "text-foreground"}`}>
                    {faq.q}
                  </span>
                  <div
                    className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                      isOpen ? "bg-white text-primary" : "bg-primary/10 text-primary"
                    }`}
                  >
                    {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                  </div>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <p className="text-base leading-relaxed text-foreground/70 m-0 px-6 py-5 bg-muted/60 rounded-b-xl border-x-2 border-b-2 border-border">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
