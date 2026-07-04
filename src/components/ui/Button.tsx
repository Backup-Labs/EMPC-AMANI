"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";
type ButtonSize = "sm" | "md" | "lg" | "icon";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  children: React.ReactNode;
}

const variants: Record<ButtonVariant, string> = {
  primary: "bg-primary text-background hover:opacity-90 shadow-md hover:shadow-lg",
  secondary: "bg-muted text-foreground hover:bg-muted/80 border border-border",
  ghost: "bg-transparent text-foreground hover:bg-foreground/5",
  outline: "bg-transparent text-foreground border border-border hover:border-primary hover:text-primary",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-10 px-5 text-xs rounded-full",
  md: "h-12 px-8 text-sm rounded-full",
  lg: "h-14 px-10 text-sm rounded-full",
  icon: "h-12 w-12 rounded-full",
};

export function Button({ variant = "primary", size = "md", href, children, className, ...props }: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 font-bold transition-all duration-200 active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none",
    variants[variant],
    sizes[size],
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
