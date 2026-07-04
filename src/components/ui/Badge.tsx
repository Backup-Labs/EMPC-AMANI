import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "glass" | "primary";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full",
        variant === "default" && "bg-primary/10 text-primary",
        variant === "glass" && "glass text-white",
        variant === "primary" && "bg-primary text-background",
        className
      )}
    >
      {children}
    </span>
  );
}
