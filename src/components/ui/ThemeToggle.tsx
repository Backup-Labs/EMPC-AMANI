"use client";

import React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useThemeMode } from "./ThemeProvider";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const { mounted } = useThemeMode();

  if (!mounted) {
    return <div className={`h-9 w-9 rounded-full bg-muted ${className}`} />;
  }

  return (
    <button
      type="button"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={`h-9 w-9 rounded-full border border-border flex items-center justify-center text-foreground/70 hover:bg-muted transition-colors cursor-pointer ${className}`}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
