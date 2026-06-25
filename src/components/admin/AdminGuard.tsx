"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
          router.replace(`/admin/login?redirectTo=${pathname}`);
          return;
        }

        // Fetch user profile from admin_profiles
        const { data: profile, error } = await supabase
          .from("admin_profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();

        if (error || !profile) {
          console.warn("No admin profile found for user:", session.user.id);
          // If no admin profile exists, sign out and redirect
          await supabase.auth.signOut();
          router.replace("/admin/login?error=unauthorized");
          return;
        }

        if (profile.role !== "admin" && profile.role !== "editor") {
          console.warn("User does not have admin/editor role:", profile.role);
          await supabase.auth.signOut();
          router.replace("/admin/login?error=unauthorized");
          return;
        }

        setAuthorized(true);
      } catch (err) {
        console.error("Admin guard error:", err);
        router.replace("/admin/login?error=error");
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [router, pathname]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
          <span className="font-bold text-xs uppercase tracking-widest text-foreground/40">
            Validating Credentials...
          </span>
        </div>
      </div>
    );
  }

  return authorized ? <>{children}</> : null;
}
