"use client";

import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface NotRobotCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
  className?: string;
  error?: string;
}

export function NotRobotCheckbox({
  checked,
  onChange,
  disabled = false,
  id = "not-robot",
  className,
  error,
}: NotRobotCheckboxProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="inline-flex items-center justify-between gap-4 px-4 py-3 rounded-xl border border-border bg-muted/50 w-full sm:w-fit max-w-full">
        <label htmlFor={id} className="flex items-center gap-3 cursor-pointer select-none">
          <input
            id={id}
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            disabled={disabled}
            required
            className="h-5 w-5 shrink-0 rounded border-border accent-primary cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
          />
          <span className="text-sm font-bold text-foreground">I&apos;m not a robot</span>
        </label>
        <ShieldCheck size={26} className="text-foreground/20 shrink-0" aria-hidden />
      </div>
      {error && <p className="text-xs font-bold text-red-600 m-0">{error}</p>}
    </div>
  );
}
