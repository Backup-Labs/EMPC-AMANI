import React from "react";
import { cn } from "@/lib/utils";

type CardVariant = "default" | "layered" | "offset" | "glass";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: CardVariant;
  hover?: boolean;
}

const variantClasses: Record<CardVariant, string> = {
  default: "bg-muted rounded-xl border border-border shadow-sm",
  layered: "card-layered",
  offset: "card-offset-border",
  glass: "glass rounded-xl",
};

export function Card({ children, className, variant = "layered", hover = true }: CardProps) {
  return (
    <div
      className={cn(
        variantClasses[variant],
        hover && variant === "default" && "hover:shadow-md hover:-translate-y-0.5 transition-all duration-300",
        "p-5",
        className
      )}
    >
      {children}
    </div>
  );
}
