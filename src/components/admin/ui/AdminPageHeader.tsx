import React from "react";
import { cn } from "@/lib/utils";

interface AdminPageHeaderProps {
  label: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function AdminPageHeader({ label, title, description, actions, className }: AdminPageHeaderProps) {
  return (
    <div className={cn("flex flex-col md:flex-row justify-between items-start md:items-center gap-6", className)}>
      <div>
        <span className="font-bold text-[11px] uppercase tracking-widest text-primary">{label}</span>
        <h1 className="font-black text-[2rem] md:text-[2.4rem] leading-none tracking-[-0.04em] mt-2 mb-0 text-foreground">
          {title}
        </h1>
        {description && (
          <p className="text-foreground/50 font-medium text-sm mt-2 mb-0 max-w-xl">{description}</p>
        )}
      </div>
      {actions && <div className="flex flex-wrap gap-3 shrink-0">{actions}</div>}
    </div>
  );
}
