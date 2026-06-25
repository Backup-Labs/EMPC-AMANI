"use client";

import React from "react";

export function WhatsAppWidget() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "25078XXXXXXX";
  const message = encodeURIComponent("Hello, I'm interested in EMPC services");
  const link = `https://wa.me/${whatsappNumber}?text=${message}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end group">
      {/* Tooltip */}
      <span className="mb-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-foreground text-background text-[11px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-lg shadow-md whitespace-nowrap">
        Chat with us on WhatsApp
      </span>

      <div className="relative h-[56px] w-[56px]">
        {/* Pulsing ring background */}
        <div className="absolute inset-0 rounded-full bg-[#25D366] opacity-60 wa-pulse-ring pointer-events-none" />

        {/* Link Button */}
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 rounded-full bg-[#25D366] flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform duration-300"
          aria-label="Chat with us on WhatsApp"
        >
          <svg viewBox="0 0 24 24" fill="white" className="h-[28px] w-[28px]">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.117 1.528 5.845L.057 23.571a.75.75 0 00.918.919l5.797-1.47A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.88 0-3.637-.493-5.157-1.355l-.369-.214-3.823.97.985-3.732-.233-.381A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
          </svg>
        </a>
      </div>

      {/* Scoped CSS for the pulse animation */}
      <style jsx global>{`
        @media (prefers-reduced-motion: no-preference) {
          .wa-pulse-ring {
            animation: wa-pulse 2s infinite ease-out;
          }
        }
        @keyframes wa-pulse {
          0% {
            transform: scale(1);
            opacity: 0.6;
          }
          100% {
            transform: scale(1.6);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
