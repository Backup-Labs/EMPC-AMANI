"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Globe } from "lucide-react";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { LOCALES, type Locale } from "@/lib/i18n/types";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  variant?: "light" | "dark";
  className?: string;
}

export function LanguageSwitcher({ variant = "dark", className }: LanguageSwitcherProps) {
  const { locale, setLocale } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = LOCALES.find((l) => l.code === locale)!;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all",
          variant === "light"
            ? "text-white/90 hover:bg-white/15 nav-text-shadow"
            : "text-foreground/70 hover:text-foreground hover:bg-foreground/5"
        )}
        aria-label="Change language"
        aria-expanded={open}
      >
        <Globe size={14} />
        <span className="uppercase tracking-wider">{current.code}</span>
        <ChevronDown size={12} className={cn("transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 min-w-[140px] glass-nav rounded-xl overflow-hidden shadow-lg z-50 py-1">
          {LOCALES.map((l) => (
            <button
              key={l.code}
              onClick={() => {
                setLocale(l.code as Locale);
                setOpen(false);
              }}
              className={cn(
                "w-full text-left px-4 py-2.5 text-sm font-medium transition-colors",
                locale === l.code
                  ? "bg-primary/10 text-primary"
                  : "text-foreground/70 hover:bg-muted hover:text-foreground"
              )}
            >
              {l.native}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
