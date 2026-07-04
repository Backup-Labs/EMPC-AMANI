"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  label: string;
  heading: React.ReactNode;
  desc?: string;
  rightEl?: React.ReactNode;
  className?: string;
  compact?: boolean;
}

export function SectionHeader({ label, heading, desc, rightEl, className, compact }: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 lg:grid-cols-[180px_1fr_1fr] gap-6 lg:gap-10 border-b border-border",
        compact ? "py-8 lg:py-10" : "py-10 lg:py-14",
        className
      )}
    >
      <div className="flex items-start gap-3 pt-1">
        <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2 block" />
        <span className="font-bold text-[12px] uppercase tracking-widest text-foreground">{label}</span>
      </div>
      <div>
        <h2 className="font-black text-[2rem] md:text-[2.6rem] lg:text-[3rem] leading-[0.92] tracking-[-0.04em] text-foreground m-0">
          {heading}
        </h2>
      </div>
      <div className="flex flex-col justify-between gap-4">
        {desc && <p className="text-base text-foreground/60 leading-relaxed m-0 max-w-md">{desc}</p>}
        {rightEl}
      </div>
    </div>
  );
}
