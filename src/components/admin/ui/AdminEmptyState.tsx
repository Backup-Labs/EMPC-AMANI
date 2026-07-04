import React from "react";
import { LucideIcon } from "lucide-react";

interface AdminEmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function AdminEmptyState({ icon: Icon, title, description, action }: AdminEmptyStateProps) {
  return (
    <div className="card-elevated p-12 text-center flex flex-col items-center gap-4">
      <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
        <Icon size={24} />
      </div>
      <h3 className="font-black text-lg text-foreground m-0">{title}</h3>
      {description && <p className="text-sm text-foreground/50 m-0 max-w-sm">{description}</p>}
      {action}
    </div>
  );
}
