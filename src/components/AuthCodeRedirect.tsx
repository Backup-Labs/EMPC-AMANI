"use client";

import { useEffect } from "react";

/**
 * If Supabase redirects to Site URL with ?code= (e.g. /?code=...),
 * forward to the auth callback so the session can be established.
 */
export function AuthCodeRedirect() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (!code) return;
    const next = params.get("next") || "/portal/dashboard";
    const safeNext = next.startsWith("/") ? next : "/portal/dashboard";
    window.location.replace(
      `/auth/callback?code=${encodeURIComponent(code)}&next=${encodeURIComponent(safeNext)}`
    );
  }, []);

  return null;
}
