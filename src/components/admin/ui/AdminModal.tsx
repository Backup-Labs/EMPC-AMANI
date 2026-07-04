"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface AdminModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  footer?: React.ReactNode;
}

const sizes = { sm: "max-w-md", md: "max-w-lg", lg: "max-w-2xl", xl: "max-w-4xl" };

export function AdminModal({ open, onClose, title, children, size = "md", footer }: AdminModalProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handler);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handler);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-200 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className={`w-full ${sizes[size]} bg-background rounded-2xl border border-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]`}
          >
            <div className="flex justify-between items-center px-6 py-4 border-b border-border shrink-0">
              <h2 className="font-black text-lg uppercase tracking-wide text-foreground m-0">{title}</h2>
              <button onClick={onClose} className="h-9 w-9 rounded-full bg-muted hover:bg-foreground/10 flex items-center justify-center transition-colors" aria-label="Close">
                <X size={16} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">{children}</div>
            {footer && <div className="px-6 py-4 border-t border-border shrink-0">{footer}</div>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
