"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function PortalLogin() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    // If user is already logged in, redirect straight to dashboard
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.replace("/portal/dashboard");
      }
    };
    checkSession();
  }, [router]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setErrorMsg("");
    setMessage("");

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;
        
        if (data.user && data.session) {
          // Immediately logged in
          router.replace("/portal/dashboard");
        } else {
          setMessage("Signup successful! Please check your email for verification.");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        router.replace("/portal/dashboard");
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      setErrorMsg(err.message || "Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center px-6 py-12">
      <div className="w-full max-w-md card-layered p-10 md:p-12">
        <div className="text-center mb-8">
          <h2 className="font-black text-3xl tracking-tighter text-foreground m-0 uppercase">
            {isSignUp ? "Create Portal Account" : "Customer Portal"}
          </h2>
          <p className="text-foreground/50 text-sm mt-3 font-bold">
            {isSignUp 
              ? "Sign up to track your inquiries and training enrollments." 
              : "Log in to view your inquiries and enrollments."}
          </p>
        </div>

        <form onSubmit={handleAuth} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-foreground/40">
              Email Address
            </label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              disabled={loading}
              className="h-12 bg-transparent border-b border-border focus:border-foreground outline-none font-bold text-base transition-colors disabled:opacity-50"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-foreground/40">
              Password
            </label>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={loading}
              className="h-12 bg-transparent border-b border-border focus:border-foreground outline-none font-bold text-base transition-colors disabled:opacity-50"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 h-14 bg-primary text-background font-black rounded-full flex items-center justify-center hover:opacity-90 active:scale-95 transition-all shadow-lg disabled:opacity-50 cursor-pointer"
          >
            {loading 
              ? "Please wait..." 
              : isSignUp ? "Sign Up" : "Log In"}
            <ArrowUpRight size={18} className="ml-2" />
          </button>
        </form>

        {message && (
          <p className="text-sm font-bold text-primary text-center mt-6 px-4">
            {message}
          </p>
        )}
        {errorMsg && (
          <p className="text-sm font-bold text-red-500 text-center mt-6 px-4">
            {errorMsg}
          </p>
        )}

        <div className="text-center mt-8 pt-6 border-t border-border/40">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setErrorMsg("");
              setMessage("");
            }}
            className="text-xs font-black uppercase tracking-wider text-primary/70 hover:text-primary transition-colors cursor-pointer"
          >
            {isSignUp 
              ? "Already have an account? Log In" 
              : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}
