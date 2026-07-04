"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange={false}>
      {children}
    </NextThemesProvider>
  );
}

export function useThemeMode() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return { mounted };
}
