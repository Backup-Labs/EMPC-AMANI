"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminStatCardProps {
  label: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  href?: string;
  trend?: { value: number; up: boolean };
  color?: "primary" | "blue" | "green" | "amber" | "purple" | "rose";
  loading?: boolean;
}

const colorMap = {
  primary: "bg-primary/10 text-primary border-primary/20",
  blue: "bg-blue-50 text-blue-600 border-blue-100",
  green: "bg-emerald-50 text-emerald-600 border-emerald-100",
  amber: "bg-amber-50 text-amber-600 border-amber-100",
  purple: "bg-purple-50 text-purple-600 border-purple-100",
  rose: "bg-rose-50 text-rose-600 border-rose-100",
};

export function AdminStatCard({ label, value, description, icon: Icon, href, trend, color = "primary", loading }: AdminStatCardProps) {
  const content = (
    <motion.div
      whileHover={href ? { y: -2 } : undefined}
      className={cn(
        "card-elevated p-6 flex flex-col gap-4 h-full transition-shadow",
        href && "cursor-pointer hover:shadow-md"
      )}
    >
      <div className="flex justify-between items-start">
        <span className="font-bold text-[10px] uppercase tracking-widest text-foreground/45">{label}</span>
        <div className={cn("h-9 w-9 rounded-xl border flex items-center justify-center", colorMap[color])}>
          <Icon size={16} />
        </div>
      </div>
      {loading ? (
        <div className="skeleton h-10 w-20 rounded-lg" />
      ) : (
        <>
          <p className="font-black text-[2.4rem] tracking-[-0.04em] text-foreground m-0 leading-none">{value}</p>
          <div className="flex items-center justify-between gap-2">
            {description && <p className="text-xs text-foreground/50 font-medium m-0">{description}</p>}
            {trend && (
              <span className={cn("flex items-center gap-0.5 text-[10px] font-bold", trend.up ? "text-emerald-600" : "text-rose-500")}>
                {trend.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {trend.value}%
              </span>
            )}
          </div>
        </>
      )}
    </motion.div>
  );

  if (href) return <Link href={href} className="no-underline text-inherit block h-full">{content}</Link>;
  return content;
}
