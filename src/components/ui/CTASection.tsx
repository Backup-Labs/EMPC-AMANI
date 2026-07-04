"use client";

import React from "react";
import { ArrowUpRight } from "lucide-react";
import { RevealOnScroll } from "./RevealOnScroll";
import { Button } from "./Button";

interface CTASectionProps {
  title: React.ReactNode;
  description?: string;
  buttonText?: string;
  buttonHref?: string;
  children?: React.ReactNode;
}

export function CTASection({ title, description, buttonText, buttonHref, children }: CTASectionProps) {
  return (
    <section className="px-6 md:px-12 lg:px-16 pb-16 lg:pb-20">
      <div className="max-w-7xl mx-auto">
        <RevealOnScroll>
          <div className="glass rounded-3xl lg:rounded-[48px] p-8 lg:p-16 overflow-hidden relative shadow-lg text-center">
            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_100%_100%,rgba(10,12,130,0.04)_0%,transparent_70%)]" />
            <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center gap-6">
              <h2 className="font-black text-[2rem] md:text-[2.8rem] leading-[0.9] tracking-[-0.04em] text-foreground m-0">
                {title}
              </h2>
              {description && (
                <p className="text-foreground/60 text-base leading-relaxed m-0">{description}</p>
              )}
              {children}
              {buttonText && buttonHref && (
                <Button href={buttonHref} size="lg">
                  {buttonText} <ArrowUpRight size={18} />
                </Button>
              )}
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
