"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { supabase } from "@/lib/supabase";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const redirectTo = searchParams.get("redirectTo") || "/admin";
  const errorParam = searchParams.get("error");

  useEffect(() => {
    if (errorParam === "unauthorized") {
      setErrorMsg("Access Denied: You do not have administrator permissions.");
    } else if (errorParam === "error") {
      setErrorMsg("An error occurred. Please check your credentials and try again.");
    }
  }, [errorParam]);

  useEffect(() => {
    // If already logged in and has admin profile, redirect
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: profile } = await supabase
          .from("admin_profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();
        
        if (profile && (profile.role === "admin" || profile.role === "editor")) {
          router.replace(redirectTo);
        }
      }
    };
    checkSession();
  }, [router, redirectTo]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setErrorMsg("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Validate that this user has an entry in admin_profiles
      const { data: profile, error: profileError } = await supabase
        .from("admin_profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();

      if (profileError || !profile || (profile.role !== "admin" && profile.role !== "editor")) {
        // Sign out since user does not have permission
        await supabase.auth.signOut();
        throw new Error("Access Denied: You do not have administrator permissions.");
      }

      router.replace(redirectTo);
    } catch (err: any) {
      console.error("Admin login error:", err);
      setErrorMsg(err.message || "Invalid login credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-black uppercase tracking-widest text-foreground/40">
          Staff Email
        </label>
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@empc-amani.com"
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
        {loading ? "Logging in..." : "Staff Authentication"}
        <ArrowUpRight size={18} className="ml-2" />
      </button>

      {errorMsg && (
        <p className="text-sm font-bold text-red-500 text-center mt-6 px-4">
          {errorMsg}
        </p>
      )}
    </form>
  );
}

export default function AdminLogin() {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center px-6 py-12">
      <div className="w-full max-w-md card-layered p-10 md:p-12">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-primary block animate-pulse" />
            <span className="font-black text-xs uppercase tracking-widest text-primary">EMPC Workspace</span>
          </div>
          <h2 className="font-black text-3xl tracking-tighter text-foreground m-0 uppercase">
            Admin Portal
          </h2>
          <p className="text-foreground/50 text-sm mt-3 font-bold">
            Log in to manage site content, inquiries, and enrollments.
          </p>
        </div>

        <Suspense fallback={
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
          </div>
        }>
          <AdminLoginForm />
        </Suspense>
      </div>
    </div>
  );
}
