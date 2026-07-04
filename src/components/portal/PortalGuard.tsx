"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";

export function PortalGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace(`/portal/login?redirectTo=${pathname}`);
        return;
      }
      // Ensure customer profile exists
      const { data: profile } = await supabase
        .from("customer_profiles")
        .select("id")
        .eq("id", session.user.id)
        .maybeSingle();

      if (!profile) {
        await supabase.from("customer_profiles").upsert([{
          id: session.user.id,
          email: session.user.email || "",
          full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || null,
          avatar_url: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture || null,
        }]);
      }
      setAuthorized(true);
      setLoading(false);
    };
    check();
  }, [router, pathname]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
          <span className="font-bold text-[10px] uppercase tracking-widest text-foreground/40">Loading portal...</span>
        </div>
      </div>
    );
  }

  return authorized ? <>{children}</> : null;
}
