"use client";

import React, { useState } from "react";
import { ArrowRight } from "lucide-react";

export function NewsletterStrip() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const json = await res.json();

      if (!res.ok && res.status !== 200) {
        throw new Error(json.error || "Subscription failed");
      }

      if (json.message === "Already subscribed" || json.success) {
        setStatus("success");
        setMessage(json.message === "Already subscribed" ? "You're already subscribed!" : "Thank you for subscribing!");
        if (json.message !== "Already subscribed") setEmail("");
      } else {
        throw new Error(json.error || "Subscription failed");
      }
    } catch (err: unknown) {
      console.error("Newsletter subscription error:", err);
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "An error occurred. Please try again.");
    }
  };

  return (
    <section className="w-full bg-muted border-t border-border py-12 px-6 md:px-12 lg:px-16 relative overflow-hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
        <div className="max-w-xl">
          <h3 className="font-black text-2xl md:text-3xl text-foreground tracking-tight m-0">
            Stay updated on new collections and training programs.
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="w-full md:w-auto max-w-md flex-1 flex flex-col gap-2">
          <div className="flex w-full gap-3">
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              disabled={status === "loading"}
              className="h-14 flex-1 px-6 rounded-full border border-border text-sm font-bold bg-background/50 focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="h-14 w-14 bg-primary text-background rounded-full flex items-center justify-center hover:opacity-90 transition-all shadow-md active:scale-95 disabled:opacity-50 shrink-0"
              aria-label="Subscribe"
            >
              <ArrowRight size={20} />
            </button>
          </div>
          {message && (
            <p
              className={`text-xs font-bold px-4 mt-1 ${
                status === "error" ? "text-red-500" : "text-primary"
              }`}
            >
              {message}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
