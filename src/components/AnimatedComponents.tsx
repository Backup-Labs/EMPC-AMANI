"use client";

import React, { useEffect, useState } from "react";
import { motion, useSpring, useTransform, animate } from "framer-motion";

export function Counter({ value, suffix = "" }: { value: number | string, suffix?: string }) {
  const [displayValue, setDisplayValue] = useState(0);
  const numericValue = typeof value === "string" ? parseInt(value) : value;

  useEffect(() => {
    if (isNaN(numericValue)) return;
    const controls = animate(0, numericValue, {
      duration: 2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate(value) {
        setDisplayValue(Math.floor(value));
      },
    });
    return () => controls.stop();
  }, [numericValue]);

  return (
    <span>
      {isNaN(numericValue) ? value : displayValue}
      {suffix}
    </span>
  );
}

export function LogoMarquee({ logos }: { logos: { name: string, icon: React.ReactNode }[] }) {
  return (
    <div className="w-full overflow-hidden relative py-10">
      <div className="absolute inset-y-0 left-0 w-24 bg-linear-to-r from-background to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-24 bg-linear-to-l from-background to-transparent z-10" />
      
      <motion.div
        className="flex gap-20 items-center w-max"
        animate={{
          x: [0, -1000],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {[...logos, ...logos, ...logos].map((logo, i) => (
          <div key={i} className="flex items-center gap-4 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-default">
            <div className="h-12 w-12 rounded-xl bg-foreground/5 flex items-center justify-center font-black text-lg">
              {logo.icon}
            </div>
            <span className="font-black text-xl tracking-tighter uppercase">{logo.name}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
